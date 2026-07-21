/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { LogIn, LogOut, Save, RefreshCw } from 'lucide-react';
import { auth, db, signInWithGoogle, logout } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/error-handler';
import { TrackerState } from './types';
import { MODULE_DEFS, DEFAULT_QUEUE, ITEM_DEFS } from './constants';
import { Countdown } from './components/Countdown';
import { Spine } from './components/Spine';
import { ModuleChecklist } from './components/ModuleChecklist';
import { PriorityQueue } from './components/PriorityQueue';
import { ToolTable } from './components/ToolTable';

const INITIAL_STATE = (uid: string): TrackerState => {
  const modules: { [key: string]: any } = {};
  MODULE_DEFS.forEach((m) => {
    modules[m.id] = {};
    ITEM_DEFS.forEach((i) => {
      modules[m.id][i.key] = i.defaultDone;
    });
  });
  return {
    m365Date: '',
    googleDate: '',
    modules,
    queue: DEFAULT_QUEUE,
    notes: '',
    ownerId: uid,
    updatedAt: serverTimestamp(),
  };
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<TrackerState | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setState(null);
      return;
    }

    const docRef = doc(db, 'trackers', user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setState(snapshot.data() as TrackerState);
        } else {
          // Initialize if it doesn't exist
          const initialState = INITIAL_STATE(user.uid);
          setDoc(docRef, initialState).catch((e) => 
            handleFirestoreError(e, OperationType.WRITE, `trackers/${user.uid}`)
          );
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `trackers/${user.uid}`);
      }
    );

    return unsubscribe;
  }, [user]);

  const updateState = useCallback(async (newState: Partial<TrackerState>) => {
    if (!user || !state) return;

    setSaveStatus('saving');
    try {
      const docRef = doc(db, 'trackers', user.uid);
      await setDoc(docRef, {
        ...state,
        ...newState,
        updatedAt: serverTimestamp(),
      });
      setSaveStatus('saved');
    } catch (e) {
      setSaveStatus('error');
      handleFirestoreError(e, OperationType.UPDATE, `trackers/${user.uid}`);
    }
  }, [user, state]);

  // Overall Completion Calculation
  const getOverallCompletion = () => {
    if (!state) return 0;
    let totalPct = 0;
    MODULE_DEFS.forEach((m) => {
      const mod = state.modules[m.id] || {};
      const done = ITEM_DEFS.filter((i) => mod[i.key]).length;
      totalPct += (done / ITEM_DEFS.length) * 100;
    });
    return Math.round(totalPct / MODULE_DEFS.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B14] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#C9A227] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_50%_-10%,_#1A1A2E_0%,_#0B0B14_55%)] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#161626] border border-[#27273D] rounded-xl p-8 text-center flex flex-col gap-6 shadow-2xl">
          <div>
            <h1 className="font-serif text-4xl text-[#E8E3D8] mb-2">The Living Name</h1>
            <p className="text-[#8E8AA3] text-sm">Production Tracker — Root to Crown, Enochian, Metatron</p>
          </div>
          <p className="text-[#E8E3D8] text-sm leading-relaxed">
            Please sign in with Google to access your production dashboard and persist your progress.
          </p>
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-3 bg-[#C9A227] text-[#1a1a0a] py-3 px-6 rounded-lg font-bold transition-all hover:bg-[#D9B237] active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!state) return null;

  const overallPct = getOverallCompletion();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_-10%,_#1A1A2E_0%,_#0B0B14_55%)] text-[#E8E3D8] font-sans px-4 py-8 md:py-12 pb-24">
      <div className="max-w-[980px] mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-wide text-[#E8E3D8] mb-1">
              The Living Name
            </h1>
            <p className="text-[#8E8AA3] text-sm md:text-base">
              Production Tracker — Root to Crown, Enochian, Metatron
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[0.7rem] text-[#8E8AA3] uppercase tracking-widest">Operator</p>
              <p className="text-sm font-medium">{user.displayName || user.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg bg-[#161626] border border-[#27273D] text-[#8E8AA3] hover:text-[#C0584F] transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Time Remaining Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif italic text-[#C9A227] text-lg">Time Remaining</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#27273D] to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Countdown
              label="Microsoft 365 Copilot Pro"
              date={state.m365Date}
              onDateChange={(d) => updateState({ m365Date: d })}
            />
            <Countdown
              label="Google AI Pro"
              date={state.googleDate}
              onDateChange={(d) => updateState({ googleDate: d })}
            />
          </div>
        </section>

        {/* Overall Progress Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif italic text-[#C9A227] text-lg">Overall Completion</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#27273D] to-transparent" />
          </div>
          <div className="bg-[#161626] border border-[#27273D] rounded-lg p-5 flex items-center gap-4">
            <div className="flex-1 h-2 bg-[#12121F] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#5C3A99] to-[#C9A227] transition-all duration-500 ease-out"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="font-mono font-bold text-[#C9A227] text-xl min-w-[60px] text-right">
              {overallPct}%
            </span>
          </div>
          <div className="mt-4">
            <Spine modules={MODULE_DEFS} states={state.modules} />
          </div>
        </section>

        {/* Module Checklist Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif italic text-[#C9A227] text-lg">Module Checklist</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#27273D] to-transparent" />
          </div>
          <ModuleChecklist
            modules={MODULE_DEFS}
            states={state.modules}
            onToggle={(modId, key, checked) => {
              const newModules = { ...state.modules };
              newModules[modId] = { ...newModules[modId], [key]: checked };
              updateState({ modules: newModules });
            }}
          />
        </section>

        {/* Tool Reference Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif italic text-[#C9A227] text-lg">Tool Reference — What For, Where</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#27273D] to-transparent" />
          </div>
          <ToolTable />
        </section>

        {/* Priority Queue & Notes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif italic text-[#C9A227] text-lg">Priority Queue — Next 7 Days</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#27273D] to-transparent" />
            </div>
            <PriorityQueue
              tasks={state.queue}
              onToggle={(idx) => {
                const newQueue = [...state.queue];
                newQueue[idx].done = !newQueue[idx].done;
                updateState({ queue: newQueue });
              }}
              onDelete={(idx) => {
                const newQueue = [...state.queue];
                newQueue.splice(idx, 1);
                updateState({ queue: newQueue });
              }}
              onAdd={(text) => {
                updateState({ queue: [...state.queue, { text, done: false }] });
              }}
            />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif italic text-[#C9A227] text-lg">Notes</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#27273D] to-transparent" />
            </div>
            <textarea
              value={state.notes}
              onChange={(e) => updateState({ notes: e.target.value })}
              placeholder="Loose thoughts, what worked, what to adjust..."
              className="w-full min-h-[220px] bg-[#161626] border border-[#27273D] text-[#E8E3D8] rounded-xl p-4 text-sm outline-none focus:border-[#C9A227] transition-colors resize-none"
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between pt-6 border-t border-[#27273D] text-[0.78rem] text-[#8E8AA3]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              saveStatus === 'saved' ? 'bg-[#5C9171]' : 
              saveStatus === 'saving' ? 'bg-[#D98E3B] animate-pulse' : 'bg-[#C0584F]'
            }`} />
            <span>{
              saveStatus === 'saved' ? 'All changes saved' : 
              saveStatus === 'saving' ? 'Saving changes...' : 'Save failed'
            }</span>
          </div>
          <button
            onClick={() => {
              if (confirm('This will reset your tracker to the default state. Continue?')) {
                updateState(INITIAL_STATE(user.uid));
              }
            }}
            className="text-[#8E8AA3] hover:text-[#C0584F] transition-colors flex items-center gap-1"
          >
            Reset all data
          </button>
        </footer>
      </div>
    </div>
  );
}

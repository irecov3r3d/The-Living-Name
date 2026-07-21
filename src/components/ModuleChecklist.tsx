/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { ModuleDef, ModuleState } from '../types';
import { ITEM_DEFS } from '../constants';

interface ModuleChecklistProps {
  modules: ModuleDef[];
  states: { [key: string]: ModuleState };
  onToggle: (moduleId: string, itemKey: string, checked: boolean) => void;
}

export const ModuleChecklist: React.FC<ModuleChecklistProps> = ({ modules, states, onToggle }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const getCompletion = (id: string) => {
    const mod = states[id] || {};
    const total = ITEM_DEFS.length;
    const done = ITEM_DEFS.filter((i) => mod[i.key]).length;
    return Math.round((done / total) * 100);
  };

  return (
    <div className="flex flex-col gap-2">
      {modules.map((m) => {
        const isOpen = openId === m.id;
        const pct = getCompletion(m.id);
        const modState = states[m.id] || {};

        return (
          <div key={m.id} className="bg-[#161626] border border-[#27273D] rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenId(isOpen ? null : m.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#12121F] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="font-semibold text-sm text-[#E8E3D8]">{m.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#8E8AA3] text-sm">{pct}%</span>
                <ChevronRight 
                  className={`w-4 h-4 text-[#8E8AA3] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
                />
              </div>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-[#27273D] pt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                      {ITEM_DEFS.map((item) => (
                        <label 
                          key={item.key} 
                          className={`flex items-center gap-2 text-sm cursor-pointer py-1 transition-colors ${
                            modState[item.key] ? 'text-[#8E8AA3] line-through' : 'text-[#E8E3D8]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={!!modState[item.key]}
                            onChange={(e) => onToggle(m.id, item.key, e.target.checked)}
                            className="w-4 h-4 rounded border-[#27273D] bg-[#12121F] text-[#C9A227] focus:ring-0 focus:ring-offset-0"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ModuleDef, ModuleState } from '../types';
import { ITEM_DEFS } from '../constants';

interface SpineProps {
  modules: ModuleDef[];
  states: { [key: string]: ModuleState };
}

export const Spine: React.FC<SpineProps> = ({ modules, states }) => {
  const getCompletion = (id: string) => {
    const mod = states[id] || {};
    const total = ITEM_DEFS.length;
    const done = ITEM_DEFS.filter((i) => mod[i.key]).length;
    return Math.round((done / total) * 100);
  };

  return (
    <div className="flex gap-4 bg-[#161626] border border-[#27273D] rounded-lg p-4 items-center overflow-x-auto no-scrollbar">
      {modules.map((m, idx) => {
        const pct = getCompletion(m.id);
        const nameLabel = m.name.split('—')[1] ? m.name.split('—')[1].trim() : m.name;
        
        return (
          <React.Fragment key={m.id}>
            <div className="flex flex-col items-center gap-1 min-w-[54px]">
              <div 
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                  pct === 100 
                    ? 'border-current shadow-[0_0_10px_currentcolor]' 
                    : 'border-[#27273D] bg-[#12121F]'
                }`}
                style={{ color: pct === 100 ? m.color : undefined, backgroundColor: pct === 100 ? m.color : undefined }}
              />
              <div className="text-[0.62rem] text-[#8E8AA3] text-center tracking-wider">{nameLabel}</div>
            </div>
            {idx < modules.length - 1 && (
              <div className="h-[2px] flex-1 bg-[#27273D] min-w-[14px]" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

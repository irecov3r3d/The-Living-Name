/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Task } from '../types';

interface PriorityQueueProps {
  tasks: Task[];
  onToggle: (idx: number) => void;
  onDelete: (idx: number) => void;
  onAdd: (text: string) => void;
}

export const PriorityQueue: React.FC<PriorityQueueProps> = ({ tasks, onToggle, onDelete, onAdd }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-[#161626] border border-[#27273D] rounded-lg p-4">
      <div className="flex flex-col">
        {tasks.map((task, idx) => (
          <div 
            key={idx} 
            className="flex items-start gap-3 py-2 border-b border-[#27273D] last:border-0"
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(idx)}
              className="mt-1 w-4 h-4 rounded border-[#27273D] bg-[#12121F] text-[#C9A227] focus:ring-0"
            />
            <span className={`flex-1 text-sm ${task.done ? 'text-[#8E8AA3] line-through' : 'text-[#E8E3D8]'}`}>
              {task.text}
            </span>
            <button 
              onClick={() => onDelete(idx)}
              className="text-[#8E8AA3] hover:text-[#C0584F] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a task..."
          className="flex-1 bg-[#12121F] border border-[#27273D] text-[#E8E3D8] rounded-md px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
        />
        <button
          onClick={handleAdd}
          className="bg-[#C9A227] text-[#1a1a0a] px-4 py-2 rounded-md font-bold text-xs flex items-center gap-1 hover:bg-[#D9B237] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
};

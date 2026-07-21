/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CountdownProps {
  label: string;
  date: string;
  onDateChange: (date: string) => void;
}

export const Countdown: React.FC<CountdownProps> = ({ label, date, onDateChange }) => {
  const daysBetween = (dateStr: string) => {
    if (!dateStr) return null;
    const target = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const days = daysBetween(date);

  const getStatusClass = (d: number | null) => {
    if (d === null) return 'text-[#C9A227]';
    if (d < 0) return 'text-[#C0584F]';
    if (d <= 2) return 'text-[#C0584F]';
    if (d <= 5) return 'text-[#D98E3B]';
    return 'text-[#5C9171]';
  };

  return (
    <div className="bg-[#161626] border border-[#27273D] rounded-lg p-4 flex flex-col gap-2">
      <label className="text-[0.78rem] text-[#8E8AA3] uppercase tracking-widest">{label}</label>
      <div className="flex items-baseline justify-between gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-[#12121F] border border-[#27273D] text-[#E8E3D8] rounded px-2 py-1 text-sm outline-none focus:border-[#C9A227]"
        />
        <span className={`font-mono font-bold text-2xl ${getStatusClass(days)}`}>
          {days === null ? '—' : days < 0 ? 'Expired' : `${days}d`}
        </span>
      </div>
    </div>
  );
};

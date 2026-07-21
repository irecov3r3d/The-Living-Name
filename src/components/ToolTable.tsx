/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const TOOLS = [
  {
    name: 'NotebookLM Plus',
    status: 'Expiring ~1wk',
    statusType: 'expiring',
    use: 'Study guides, FAQs, and Audio Overviews for each module. Highest-value tool right now — burn through this first.'
  },
  {
    name: 'M365 Copilot Pro',
    status: 'Expiring ~1wk',
    statusType: 'expiring',
    use: "Turning finished text into polished Word manuscript chapters and a PowerPoint course deck. Best tool for taking what's already written and making it deliverable-looking."
  },
  {
    name: 'Gemini 2.5/3 Pro',
    status: 'Expiring ~1wk',
    statusType: 'expiring',
    use: 'Long-document consistency review, Hebrew/Greek word-study verification, cross-tradition accuracy checks, production planning.'
  },
  {
    name: 'Jules',
    status: '100/day, expiring',
    statusType: 'expiring',
    use: "Only if you decide to build a custom web app (meditation timer, sacred-geometry visualizer). Skip unless you want custom tech — content work doesn't need it."
  },
  {
    name: 'Suno Pro',
    status: '2900 credits',
    statusType: 'unlimited',
    use: 'Every meditation track, activation track, and ambient piece across all 9 modules. No urgency — this outlasts the Google/Microsoft trials.'
  },
  {
    name: 'Grok / SuperGrok',
    status: 'Active',
    statusType: 'active',
    use: "All sacred-art images: chakra anatomy, archangels, Tree of Life, Metatron's Cube, Watchtowers."
  },
  {
    name: 'Claude (here)',
    status: 'Active',
    statusType: 'active',
    use: 'Ongoing refinement, troubleshooting, new content, and this tracker. No expiration pressure — use for anything not time-boxed.'
  }
];

export const ToolTable: React.FC = () => {
  const getStatusStyle = (type: string) => {
    switch (type) {
      case 'active': return 'bg-[rgba(92,145,113,0.18)] text-[#5C9171]';
      case 'expiring': return 'bg-[rgba(217,142,59,0.18)] text-[#D98E3B]';
      case 'unlimited': return 'bg-[rgba(139,111,217,0.18)] text-[#8B6FD9]';
      default: return 'bg-[#27273D] text-[#8E8AA3]';
    }
  };

  return (
    <div className="bg-[#161626] border border-[#27273D] rounded-lg overflow-hidden">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-[#12121F]">
            <th className="p-3 text-[#C9A227] font-semibold uppercase text-[0.7rem] tracking-wider border-b border-[#27273D]">Tool</th>
            <th className="p-3 text-[#C9A227] font-semibold uppercase text-[0.7rem] tracking-wider border-b border-[#27273D]">Status</th>
            <th className="p-3 text-[#C9A227] font-semibold uppercase text-[0.7rem] tracking-wider border-b border-[#27273D]">Use it for</th>
          </tr>
        </thead>
        <tbody>
          {TOOLS.map((tool, idx) => (
            <tr key={idx} className="border-b border-[#27273D] last:border-0 hover:bg-[#12121F] transition-colors">
              <td className="p-3 font-bold text-[#E8E3D8] align-top">{tool.name}</td>
              <td className="p-3 align-top">
                <span className={`inline-block text-[0.72rem] px-2 py-0.5 rounded-full font-semibold ${getStatusStyle(tool.statusType)}`}>
                  {tool.status}
                </span>
              </td>
              <td className="p-3 text-[#E8E3D8] align-top leading-relaxed">{tool.use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

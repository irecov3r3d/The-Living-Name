/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModuleDef, ItemDef } from './types';

export const MODULE_DEFS: ModuleDef[] = [
  { id: 'lvl1', name: 'Level 1 — Root', color: '#C0584F' },
  { id: 'lvl2', name: 'Level 2 — Sacral', color: '#D98E3B' },
  { id: 'lvl3', name: 'Level 3 — Solar Plexus', color: '#D9C23B' },
  { id: 'lvl4', name: 'Level 4 — Heart', color: '#5C9171' },
  { id: 'lvl5', name: 'Level 5 — Throat', color: '#3B83D9' },
  { id: 'lvl6', name: 'Level 6 — Third Eye', color: '#5C5CD9' },
  { id: 'lvl7', name: 'Level 7 — Crown', color: '#8B6FD9' },
  { id: 'enoch', name: 'Module 8 — Enochian', color: '#C9A227' },
  { id: 'metatron', name: 'Module 9 — Metatron', color: '#E8E3D8' },
];

export const ITEM_DEFS: ItemDef[] = [
  { key: 'content', label: 'Content written', defaultDone: true },
  { key: 'studyguide', label: 'NotebookLM study guide', defaultDone: false },
  { key: 'faq', label: 'NotebookLM FAQ', defaultDone: false },
  { key: 'audio_overview', label: 'NotebookLM audio overview', defaultDone: false },
  { key: 'suno', label: 'Suno track(s) generated', defaultDone: false },
  { key: 'grok', label: 'Grok image(s) generated', defaultDone: false },
  { key: 'practice', label: 'Personally practiced (7 days)', defaultDone: false },
];

export const DEFAULT_QUEUE = [
  { text: 'Compile all 9 modules into one master doc', done: false },
  { text: 'Create 9 NotebookLM notebooks + generate study guides', done: false },
  { text: 'Generate all 9 audio overviews', done: false },
  { text: 'Generate priority Suno tracks (Root, Heart, Crown, Metatron Cube)', done: false },
  { text: 'Generate priority Grok images (7-chakra diagram, Metatron, Tree of Life)', done: false },
  { text: 'Use Copilot to format Level 1-2 into Word manuscript chapters', done: false },
];

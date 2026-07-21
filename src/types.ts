/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Task {
  text: string;
  done: boolean;
}

export interface ModuleState {
  [key: string]: boolean;
}

export interface TrackerState {
  m365Date: string;
  googleDate: string;
  modules: { [key: string]: ModuleState };
  queue: Task[];
  notes: string;
  ownerId: string;
  updatedAt: any; // Firestore server timestamp
}

export interface ModuleDef {
  id: string;
  name: string;
  color: string;
}

export interface ItemDef {
  key: string;
  label: string;
  defaultDone: boolean;
}

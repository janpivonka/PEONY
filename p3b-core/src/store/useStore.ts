import { create } from 'zustand';

interface SceneState {
  coreColor: string;
  coreDistort: number;
  isBoostMode: boolean;
  setCoreColor: (color: string) => void;
  setBoostMode: (active: boolean) => void;
}

export const useStore = create<SceneState>((set) => ({
  coreColor: "#FF6AC1",
  coreDistort: 0.25,
  isBoostMode: false,
  setCoreColor: (color) => set({ coreColor: color }),
  setBoostMode: (active) => set({ isBoostMode: active }),
}));
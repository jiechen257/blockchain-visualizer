import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ActivityEvent } from './types';

const MAX_ACTIVITY_FEED_SIZE = 20;

export interface ExperienceSlice {
  activityFeed: ActivityEvent[];
  selectedBlockHash: string | null;
  isSimulating: boolean;
  simulationSpeed: number;
  focusedAction: 'transaction' | 'mining' | null;
  preferredMinerAddress: string | null;
  pushActivity: (event: Omit<ActivityEvent, 'id'>) => void;
  setSelectedBlockHash: (hash: string | null) => void;
  setSimulationState: (next: boolean) => void;
  setSimulationSpeed: (next: number) => void;
  setFocusedAction: (next: 'transaction' | 'mining' | null) => void;
  setPreferredMinerAddress: (address: string | null) => void;
}

export const createExperienceSlice: StateCreator<
  ExperienceSlice,
  [],
  [],
  ExperienceSlice
> = (set, get) => ({
  activityFeed: [],
  selectedBlockHash: null,
  isSimulating: false,
  simulationSpeed: 1000,
  focusedAction: null,
  preferredMinerAddress: null,
  pushActivity: (event) => set((state) => ({
    // 仅保留最近 20 条事件，避免 feed 无界增长。
    activityFeed: [{ ...event, id: uuidv4() }, ...state.activityFeed].slice(0, MAX_ACTIVITY_FEED_SIZE),
  })),
  setSelectedBlockHash: (hash) => set({ selectedBlockHash: hash }),
  setSimulationState: (next) => {
    const current = get().isSimulating;
    if (current === next) {
      return;
    }

    get().pushActivity({
      type: next ? 'simulation.started' : 'simulation.stopped',
      title: next ? '网络模拟已启动' : '网络模拟已停止',
      timestamp: Date.now(),
    });
    set({ isSimulating: next });
  },
  setSimulationSpeed: (next) => set({ simulationSpeed: next }),
  setFocusedAction: (next) => set({ focusedAction: next }),
  setPreferredMinerAddress: (address) => set({ preferredMinerAddress: address }),
});

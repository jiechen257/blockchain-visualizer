import { StateCreator } from 'zustand';
import {
  ActivityEvent,
  BlockchainState,
  ExplanationLevel,
  GuideStep,
  LabMode,
  LabSelectedEntity,
  TimelineStep,
} from './types';

const GUIDE_SEQUENCE: GuideStep[] = [
  'wallet',
  'transaction',
  'broadcast',
  'mempool',
  'mining',
  'confirmed',
];

export interface LabFlowSlice {
  activeMode: LabMode;
  guideStep: GuideStep;
  timelineStep: TimelineStep;
  explanationLevel: ExplanationLevel;
  selectedEntity: LabSelectedEntity | null;
  isPlaybackRunning: boolean;
  setActiveMode: (mode: LabMode) => void;
  advanceGuideStep: () => void;
  rewindGuideStep: () => void;
  setTimelineStep: (step: TimelineStep) => void;
  setExplanationLevel: (level: ExplanationLevel) => void;
  setSelectedEntity: (entity: LabSelectedEntity | null) => void;
  setPlaybackRunning: (next: boolean) => void;
  syncGuideFromState: () => void;
}

type DomainActions = {
  activityFeed: ActivityEvent[];
};

type LabFlowState = BlockchainState & DomainActions & LabFlowSlice;

const getNextStep = (step: GuideStep) => {
  const currentIndex = GUIDE_SEQUENCE.indexOf(step);
  return GUIDE_SEQUENCE[Math.min(currentIndex + 1, GUIDE_SEQUENCE.length - 1)];
};

const getPreviousStep = (step: GuideStep) => {
  const currentIndex = GUIDE_SEQUENCE.indexOf(step);
  return GUIDE_SEQUENCE[Math.max(currentIndex - 1, 0)];
};

const guideStepToTimeline = (step: GuideStep): TimelineStep => {
  if (step === 'wallet' || step === 'transaction') {
    return 'draft';
  }
  return step;
};

export const createLabFlowSlice: StateCreator<
  LabFlowState,
  [],
  [],
  LabFlowSlice
> = (set, get) => ({
  activeMode: 'guided',
  guideStep: 'wallet',
  timelineStep: 'draft',
  explanationLevel: 'basic',
  selectedEntity: null,
  isPlaybackRunning: false,
  setActiveMode: (mode) => set({ activeMode: mode }),
  advanceGuideStep: () =>
    set((state) => {
      const nextGuideStep = getNextStep(state.guideStep);
      return {
        guideStep: nextGuideStep,
        timelineStep: guideStepToTimeline(nextGuideStep),
      };
    }),
  rewindGuideStep: () =>
    set((state) => {
      const previousGuideStep = getPreviousStep(state.guideStep);
      return {
        guideStep: previousGuideStep,
        timelineStep: guideStepToTimeline(previousGuideStep),
      };
    }),
  setTimelineStep: (step) => set({ timelineStep: step }),
  setExplanationLevel: (level) => set({ explanationLevel: level }),
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),
  setPlaybackRunning: (next) => set({ isPlaybackRunning: next }),
  syncGuideFromState: () => {
    const state = get();
    const mainChain = state.chains.find((chain) => chain.isMain);
    const latestBlock = mainChain?.blocks.at(-1);
    const latestActivity = state.activityFeed[0];

    if (
      latestActivity?.type === 'block.mined' &&
      latestBlock &&
      latestBlock.transactions.length > 0
    ) {
      set({
        guideStep: 'confirmed',
        timelineStep: 'confirmed',
        selectedEntity: { type: 'block', id: latestBlock.hash },
        isPlaybackRunning: false,
      });
      return;
    }

    if (state.pendingTransactions.length > 0) {
      set({
        guideStep: 'mempool',
        timelineStep: 'mempool',
        selectedEntity: { type: 'transaction', id: state.pendingTransactions[0].id },
        isPlaybackRunning: false,
      });
      return;
    }

    if (state.wallets.length > 0) {
      set({
        guideStep: 'transaction',
        timelineStep: 'draft',
        selectedEntity: { type: 'wallet', id: state.wallets[0].address },
      });
      return;
    }

    set({
      guideStep: 'wallet',
      timelineStep: 'draft',
      selectedEntity: null,
      isPlaybackRunning: false,
    });
  },
});

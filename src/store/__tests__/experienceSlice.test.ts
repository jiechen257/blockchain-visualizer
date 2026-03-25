import { beforeEach, describe, expect, it } from 'vitest';
import useBlockchainStore from '@/store/useBlockchainStore';
import { resetBlockchainStore } from '@/test/renderWithStore';

describe('experienceSlice', () => {
  beforeEach(() => {
    resetBlockchainStore();
  });

  it('keeps only the latest 20 activity events', () => {
    const store = useBlockchainStore.getState();

    for (let index = 0; index < 21; index += 1) {
      store.pushActivity({
        type: 'wallet.created',
        title: `wallet ${index}`,
        timestamp: index,
      });
    }

    const activityFeed = useBlockchainStore.getState().activityFeed;
    expect(activityFeed).toHaveLength(20);
    expect(activityFeed[0].title).toBe('wallet 1');
    expect(activityFeed[19].title).toBe('wallet 20');
  });

  it('does not persist experience state fields into localStorage', () => {
    const store = useBlockchainStore.getState();
    store.setSimulationState(true);
    store.setSimulationSpeed(5);
    store.setSelectedBlockHash('block-hash-1');
    store.pushActivity({
      type: 'wallet.created',
      title: 'created',
      timestamp: Date.now(),
    });
    store.createWallet();

    const raw = globalThis.localStorage.getItem('blockchain-storage');
    expect(raw).not.toBeNull();
    const persistedWrapper = JSON.parse(raw as string) as { state: Record<string, unknown> };
    const persisted = persistedWrapper.state;

    expect(persisted.wallets.length).toBe(1);
    expect(persisted.activityFeed).toBeUndefined();
    expect(persisted.selectedBlockHash).toBeUndefined();
    expect(persisted.isSimulating).toBeUndefined();
    expect(persisted.simulationSpeed).toBeUndefined();
  });
});

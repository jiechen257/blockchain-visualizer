import { beforeEach, describe, expect, it } from 'vitest';
import useBlockchainStore from '@/store/useBlockchainStore';
import { resetBlockchainStore } from '@/test/renderWithStore';

describe('experienceSlice', () => {
  beforeEach(() => {
    resetBlockchainStore();
  });

  it('keeps only the latest 20 activity events', () => {
    const store = useBlockchainStore.getState() as any;

    for (let index = 0; index < 21; index += 1) {
      store.pushActivity({
        type: 'wallet.created',
        title: `wallet ${index}`,
        timestamp: index,
      });
    }

    const activityFeed = (useBlockchainStore.getState() as any).activityFeed;
    expect(activityFeed).toHaveLength(20);
    expect(activityFeed[0].title).toBe('wallet 1');
    expect(activityFeed[19].title).toBe('wallet 20');
  });
});

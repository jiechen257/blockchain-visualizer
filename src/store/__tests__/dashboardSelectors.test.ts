import { describe, expect, it } from 'vitest';
import { selectDashboardStats } from '@/store/dashboardSelectors';

describe('dashboardSelectors', () => {
  it('derives dashboard stats from store state', () => {
    const stats = selectDashboardStats({
      wallets: [{ address: 'a', balance: 100, privateKey: 'p', publicKey: 'g' }],
      pendingTransactions: [{ id: '1', from: 'a', to: 'b', amount: 2, fee: 1, timestamp: 1 }],
      chains: [{ id: 'main', isMain: true, blocks: [{ index: 0, timestamp: 1, transactions: [], previousHash: '0', hash: 'abc', nonce: 0 }] }],
      isSimulating: true,
    } as any);

    expect(stats.pendingCount.value).toBe(1);
    expect(stats.networkStatus.value).toBe('运行中');
  });
});

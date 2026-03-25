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

    expect(stats.walletCount.value).toBe(1);
    expect(stats.pendingCount.value).toBe(1);
    expect(stats.chainHeight.value).toBe(1);
    expect(stats.latestHash.value).toBe('abc');
    expect(stats.networkStatus.value).toBe('运行中');
  });

  it('returns fallback values when there is no main chain', () => {
    const stats = selectDashboardStats({
      wallets: [],
      pendingTransactions: [],
      chains: [{ id: 'fork-1', isMain: false, blocks: [{ index: 0, timestamp: 1, transactions: [], previousHash: '0', hash: 'forkhash123', nonce: 0 }] }],
      isSimulating: false,
    } as any);

    expect(stats.walletCount.value).toBe(0);
    expect(stats.pendingCount.value).toBe(0);
    expect(stats.chainHeight.value).toBe(0);
    expect(stats.latestHash.value).toBe('--');
    expect(stats.networkStatus.value).toBe('已停止');
  });

  it('returns empty-latest-hash fallback when main chain has no blocks', () => {
    const stats = selectDashboardStats({
      wallets: [{ address: 'a', balance: 100, privateKey: 'p', publicKey: 'g' }],
      pendingTransactions: [],
      chains: [{ id: 'main', isMain: true, blocks: [] }],
      isSimulating: false,
    } as any);

    expect(stats.walletCount.value).toBe(1);
    expect(stats.pendingCount.value).toBe(0);
    expect(stats.chainHeight.value).toBe(0);
    expect(stats.latestHash.value).toBe('--');
    expect(stats.networkStatus.value).toBe('已停止');
  });
});

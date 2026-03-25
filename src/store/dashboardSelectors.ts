import type { FullState } from './useBlockchainStore';

export type DashboardStatsState = Pick<
  FullState,
  'wallets' | 'pendingTransactions' | 'chains' | 'isSimulating' | 'activityFeed'
>;

export const selectDashboardStats = (state: DashboardStatsState) => {
  // 首页总览统一基于主链派生，避免各处重复查找逻辑。
  const mainChain = state.chains.find((chain) => chain.isMain);

  return {
    walletCount: { label: '钱包数量', value: state.wallets.length },
    pendingCount: { label: '待确认交易', value: state.pendingTransactions.length },
    chainHeight: { label: '主链高度', value: mainChain?.blocks.length ?? 0 },
    latestHash: { label: '最新区块', value: mainChain?.blocks.at(-1)?.hash?.slice(0, 10) ?? '--' },
    networkStatus: { label: '网络状态', value: state.isSimulating ? '运行中' : '已停止' },
  };
};

export const selectChecklist = (state: Pick<FullState, 'wallets' | 'activityFeed'>) => [
  { key: 'wallet', label: '创建一个钱包', done: state.wallets.length > 0 },
  {
    key: 'transaction',
    label: '发起一笔交易',
    done: state.activityFeed.some((item) => item.type === 'transaction.created'),
  },
  {
    key: 'mined',
    label: '挖出一个新区块',
    done: state.activityFeed.some((item) => item.type === 'block.mined'),
  },
];

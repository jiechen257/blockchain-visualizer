import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ActivityEvent, BlockchainState, Chain, Block } from './types';

export interface BlockchainSlice {
  chains: Chain[];
  addChain: (blocks: Block[]) => void;
  addBlockToChain: (chainId: string, block: Block) => void;
  resolveChainFork: () => void;
}

type ActivityActions = {
  pushActivity: (event: Omit<ActivityEvent, 'id'>) => void;
};

export const createBlockchainSlice: StateCreator<
  BlockchainState & ActivityActions,
  [],
  [],
  BlockchainSlice
> = (set, get) => ({
  chains: [{ id: 'main', blocks: [], isMain: true }],
  addChain: (blocks) => {
    set((state) => ({
      chains: [...state.chains, { id: uuidv4(), blocks, isMain: false }]
    }));

    get().pushActivity({
      type: 'fork.created',
      title: '检测到链分叉',
      description: `新增分叉链，当前块数 ${blocks.length}`,
      timestamp: Date.now(),
    });
  },
  addBlockToChain: (chainId, block) => {
    const hasTargetChain = get().chains.some((chain) => chain.id === chainId);
    if (!hasTargetChain) {
      return;
    }

    set((state) => ({
      chains: state.chains.map(chain =>
        chain.id === chainId
          ? { ...chain, blocks: [...chain.blocks, block] }
          : chain
      )
    }));

    get().pushActivity({
      type: 'block.mined',
      title: '新区块已加入链',
      description: `${block.hash.slice(0, 10)}...`,
      timestamp: Date.now(),
    });
  },
  resolveChainFork: () => {
    const currentChains = get().chains;
    if (currentChains.length <= 1) {
      return;
    }

    const longestChain = currentChains.reduce((longest, current) =>
      current.blocks.length > longest.blocks.length ? current : longest
    );

    set({
      chains: [{ ...longestChain, isMain: true }]
    });

    get().pushActivity({
      type: 'fork.resolved',
      title: '分叉已收敛',
      description: `主链切换为长度 ${longestChain.blocks.length}`,
      timestamp: Date.now(),
    });
  },
});

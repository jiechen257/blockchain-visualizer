import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { BlockchainState, Chain, Block } from './types';

export interface BlockchainSlice {
  chains: Chain[];
  addChain: (blocks: Block[]) => void;
  addBlockToChain: (chainId: string, block: Block) => void;
  resolveChainFork: () => void;
}

export const createBlockchainSlice: StateCreator<
  BlockchainState,
  [],
  [],
  BlockchainSlice
> = (set) => ({
  chains: [{ id: 'main', blocks: [], isMain: true }],
  addChain: (blocks) => set((state) => ({
    chains: [...state.chains, { id: uuidv4(), blocks, isMain: false }]
  })),
  addBlockToChain: (chainId, block) => set((state) => ({
    chains: state.chains.map(chain => 
      chain.id === chainId 
        ? { ...chain, blocks: [...chain.blocks, block] }
        : chain
    )
  })),
  resolveChainFork: () => set((state) => {
    const longestChain = state.chains.reduce((longest, current) => 
      current.blocks.length > longest.blocks.length ? current : longest
    );
    return {
      chains: [{ ...longestChain, isMain: true }]
    };
  }),
});
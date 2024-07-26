import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { BlockchainState, Miner, Block } from './types';
import { BlockchainSlice } from './blockchainSlice';
import { createNewBlock } from '../utils/blockchain';

export interface MinerSlice {
  miners: Miner[];
  addMiner: (miner: Omit<Miner, 'id'>) => void;
  removeMiner: (id: string) => void;
  simulateMining: () => void;
}

type MinerSliceWithDependencies = MinerSlice & BlockchainSlice;

export const createMinerSlice: StateCreator<
  BlockchainState & BlockchainSlice,
  [],
  [],
  MinerSlice
> = (set, get) => ({
  miners: [],
  addMiner: (miner) => set((state) => ({
    miners: [...state.miners, { ...miner, id: uuidv4() }]
  })),
  removeMiner: (id) => set((state) => ({
    miners: state.miners.filter(m => m.id !== id)
  })),
  simulateMining: () => {
    const state = get() as unknown as MinerSliceWithDependencies;
    const { miners, chains, addBlockToChain, addChain } = state;
    const mainChain = chains.find(chain => chain.isMain);
    if (!mainChain) return;

    const totalHashPower = miners.reduce((sum, miner) => sum + miner.hashPower, 0);
    const winningMinerIndex = Math.floor(Math.random() * totalHashPower);
    let accumulatedHashPower = 0;
    const winningMiner = miners.find(miner => {
      accumulatedHashPower += miner.hashPower;
      return accumulatedHashPower > winningMinerIndex;
    });

    if (!winningMiner) return;

    if (winningMiner.strategy === 'honest') {
      const newBlock = createNewBlock(mainChain.blocks[mainChain.blocks.length - 1]);
      addBlockToChain(mainChain.id, newBlock);
    } else if (winningMiner.strategy === 'selfish') {
      const shouldFork = Math.random() < 0.3;
      if (shouldFork) {
        const newChain = [...mainChain.blocks];
        const newBlock = createNewBlock(newChain[newChain.length - 1]);
        newChain.push(newBlock);
        addChain(newChain);
      } else {
        const newBlock = createNewBlock(mainChain.blocks[mainChain.blocks.length - 1]);
        addBlockToChain(mainChain.id, newBlock);
      }
    }
  },
});
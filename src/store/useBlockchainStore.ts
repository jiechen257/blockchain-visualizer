import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlockchainState } from './types';
import { createBlockchainSlice, BlockchainSlice } from './blockchainSlice';
import { createWalletSlice, WalletSlice } from './walletSlice';
import { createMinerSlice, MinerSlice } from './minerSlice';
import { createTransactionSlice, TransactionSlice } from './transactionSlice';
import { createExperienceSlice, ExperienceSlice } from './experienceSlice';
import { createLabFlowSlice, LabFlowSlice } from './labFlowSlice';

export type FullState = BlockchainState &
  BlockchainSlice &
  WalletSlice &
  MinerSlice &
  TransactionSlice &
  ExperienceSlice &
  LabFlowSlice;

const useBlockchainStore = create<FullState>()(
  persist(
    (set, get, api) => ({
      ...createBlockchainSlice(set, get, api),
      ...createWalletSlice(set, get, api),
      ...createMinerSlice(set, get, api),
      ...createTransactionSlice(set, get, api),
      ...createExperienceSlice(set, get, api),
      ...createLabFlowSlice(set, get, api),
    }),
    {
      name: 'blockchain-storage',
      partialize: (state) => ({
        chains: state.chains,
        pendingTransactions: state.pendingTransactions,
        wallets: state.wallets,
        miners: state.miners,
      }),
    }
  )
);

export default useBlockchainStore;

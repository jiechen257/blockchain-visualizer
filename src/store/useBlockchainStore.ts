import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlockchainState } from './types';
import { createBlockchainSlice, BlockchainSlice } from './blockchainSlice';
import { createWalletSlice, WalletSlice } from './walletSlice';
import { createMinerSlice, MinerSlice } from './minerSlice';
import { createTransactionSlice, TransactionSlice } from './transactionSlice';

type FullState = BlockchainState & BlockchainSlice & WalletSlice & MinerSlice & TransactionSlice;

const useBlockchainStore = create<FullState>()(
  persist(
    (set, get, api) => ({
      ...createBlockchainSlice(set, get, api),
      ...createWalletSlice(set, get, api),
      ...createMinerSlice(set, get, api),
      ...createTransactionSlice(set, get, api),
    }),
    {
      name: 'blockchain-storage',
    }
  )
);

export default useBlockchainStore;
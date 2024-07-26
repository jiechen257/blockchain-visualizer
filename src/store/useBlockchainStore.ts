import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

interface Wallet {
  address: string;
  balance: number;
}

interface BlockchainState {
  blockchain: Block[];
  pendingTransactions: Transaction[];
  wallets: Wallet[];
  addBlock: (block: Block) => void;
  addTransaction: (transaction: Transaction) => void;
  addWallet: (wallet: Wallet) => void;
  updateWalletBalance: (address: string, amount: number) => void;
}

export const useBlockchainStore = create<BlockchainState>()(
  persist(
    (set) => ({
      blockchain: [],
      pendingTransactions: [],
      wallets: [],
      addBlock: (block) => set((state) => ({ blockchain: [...state.blockchain, block] })),
      addTransaction: (transaction) => set((state) => ({ pendingTransactions: [...state.pendingTransactions, transaction] })),
      addWallet: (wallet) => set((state) => ({ wallets: [...state.wallets, wallet] })),
      updateWalletBalance: (address, amount) => set((state) => ({
        wallets: state.wallets.map(w => w.address === address ? { ...w, balance: w.balance + amount } : w)
      })),
    }),
    {
      name: 'blockchain-storage',
    }
  )
);
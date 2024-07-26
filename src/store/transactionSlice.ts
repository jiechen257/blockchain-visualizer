import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { BlockchainState, Transaction } from './types';

export interface TransactionSlice {
  pendingTransactions: Transaction[];
  addPendingTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removePendingTransaction: (id: string) => void;
}

export const createTransactionSlice: StateCreator<
  BlockchainState,
  [],
  [],
  TransactionSlice
> = (set) => ({
  pendingTransactions: [],
  addPendingTransaction: (transaction) => set((state) => ({
    pendingTransactions: [...state.pendingTransactions, { ...transaction, id: uuidv4() }]
  })),
  removePendingTransaction: (id) => set((state) => ({
    pendingTransactions: state.pendingTransactions.filter(t => t.id !== id)
  })),
});
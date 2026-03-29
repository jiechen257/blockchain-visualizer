import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ActivityEvent, BlockchainState, Transaction } from './types';

export interface TransactionSlice {
  pendingTransactions: Transaction[];
  addPendingTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removePendingTransaction: (id: string) => void;
}

type ActivityActions = {
  pushActivity: (event: Omit<ActivityEvent, 'id'>) => void;
};

export const createTransactionSlice: StateCreator<
  BlockchainState & ActivityActions,
  [],
  [],
  TransactionSlice
> = (set, get) => ({
  pendingTransactions: [],
  addPendingTransaction: (transaction) => {
    set((state) => ({
      pendingTransactions: [...state.pendingTransactions, { ...transaction, id: uuidv4() }]
    }));

    get().pushActivity({
      type: 'transaction.created',
      title: '已创建待确认交易',
      description: `${transaction.from.slice(0, 8)}... -> ${transaction.to.slice(0, 8)}...`,
      timestamp: Date.now(),
    });
  },
  removePendingTransaction: (id) => set((state) => ({
    pendingTransactions: state.pendingTransactions.filter(t => t.id !== id)
  })),
});

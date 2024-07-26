import create from 'zustand';
import { persist } from 'zustand/middleware';
import { isValidChain, mineBlock } from '../utils/blockchain';

// 定义区块接口
interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

// 定义交易接口
interface Transaction {
  from: string;
  to: string;
  amount: number;
  fee: number;
  timestamp: number;
}

// 定义钱包接口
interface Wallet {
  address: string;
  balance: number;
}

// 定义区块链状态接口
interface BlockchainState {
  blockchain: Block[];
  pendingTransactions: Transaction[];
  wallets: Wallet[];
  difficulty: number;
  miningReward: number;
  addBlock: (block: Block) => void;
  addTransaction: (transaction: Transaction) => void;
  addWallet: (wallet: Wallet) => void;
  updateWalletBalance: (address: string, amount: number) => void;
  validateChain: () => boolean;
  minePendingTransactions: (miningRewardAddress: string) => void;
}

// 创建并导出区块链状态存储
export const useBlockchainStore = create<BlockchainState>()(
  persist(
    (set, get) => ({
      blockchain: [],
      pendingTransactions: [],
      wallets: [],
      difficulty: 4,
      miningReward: 10,
      addBlock: (block) => set((state) => ({ blockchain: [...state.blockchain, block] })),
      addTransaction: (transaction) => set((state) => ({ pendingTransactions: [...state.pendingTransactions, transaction] })),
      addWallet: (wallet) => set((state) => ({ wallets: [...state.wallets, wallet] })),
      updateWalletBalance: (address, amount) => set((state) => ({
        wallets: state.wallets.map(w => w.address === address ? { ...w, balance: w.balance + amount } : w)
      })),
      validateChain: () => {
        const { blockchain } = get();
        return isValidChain(blockchain);
      },
      minePendingTransactions: (miningRewardAddress) => set((state) => {
        const newBlock = {
          index: state.blockchain.length,
          timestamp: Date.now(),
          transactions: state.pendingTransactions,
          previousHash: state.blockchain[state.blockchain.length - 1]?.hash || '0',
          hash: '',
          nonce: 0,
        };
        const minedBlock = mineBlock(newBlock, state.difficulty);
        
        return {
          blockchain: [...state.blockchain, minedBlock],
          pendingTransactions: [
            {
              from: "Network",
              to: miningRewardAddress,
              amount: state.miningReward,
              fee: 0,
              timestamp: Date.now(),
            },
          ],
          wallets: state.wallets.map(w => 
            w.address === miningRewardAddress 
              ? { ...w, balance: w.balance + state.miningReward } 
              : w
          ),
        };
      }),
    }),
    {
      name: 'blockchain-storage',
    }
  )
);
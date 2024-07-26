export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  timestamp: number;
  signature?: string;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface Chain {
  id: string;
  blocks: Block[];
  isMain: boolean;
}

export interface Wallet {
  address: string;
  balance: number;
  privateKey: string;
  publicKey: string;
}

export interface Miner {
  id: string;
  name: string;
  hashPower: number;
  strategy: 'honest' | 'selfish';
}

export interface BlockchainState {
  chains: Chain[];
  pendingTransactions: Transaction[];
  wallets: Wallet[];
  miners: Miner[];
}
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

export interface ActivityEvent {
  id: string;
  type: 'wallet.created' | 'transaction.created' | 'block.mined' | 'fork.created' | 'fork.resolved' | 'simulation.started' | 'simulation.stopped';
  title: string;
  description?: string;
  timestamp: number;
}

export type LabMode = 'guided' | 'sandbox' | 'advanced' | 'glossary';

export type GuideStep =
  | 'wallet'
  | 'transaction'
  | 'broadcast'
  | 'mempool'
  | 'mining'
  | 'confirmed';

export type TimelineStep = 'draft' | 'broadcast' | 'mempool' | 'mining' | 'confirmed';

export type ExplanationLevel = 'basic' | 'deep';

export interface LabSelectedEntity {
  type: 'wallet' | 'transaction' | 'node' | 'mempool' | 'miner' | 'block' | 'chain';
  id: string;
}

export interface BlockchainState {
  chains: Chain[];
  pendingTransactions: Transaction[];
  wallets: Wallet[];
  miners: Miner[];
}

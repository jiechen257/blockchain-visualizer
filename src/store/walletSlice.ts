import { StateCreator } from 'zustand';
import EC from 'elliptic';
import SHA256 from 'crypto-js/sha256';
import { BlockchainState, Wallet, Transaction } from './types';

const ec = new EC.ec('secp256k1');

export interface WalletSlice {
  wallets: Wallet[];
  createWallet: () => void;
  signTransaction: (fromAddress: string, toAddress: string, amount: number) => Transaction | null;
}

export const createWalletSlice: StateCreator<
  BlockchainState,
  [],
  [],
  WalletSlice
> = (set, get) => ({
  wallets: [],
  createWallet: () => set((state) => {
    const key = ec.genKeyPair();
    const privateKey = key.getPrivate('hex');
    const publicKey = key.getPublic('hex');
    const address = publicKey.slice(0, 40);
    return {
      wallets: [...state.wallets, { address, balance: 100, privateKey, publicKey }]
    };
  }),
  signTransaction: (fromAddress, toAddress, amount) => {
    const wallet = get().wallets.find(w => w.address === fromAddress);
    if (!wallet) return null;
    
    const key = ec.keyFromPrivate(wallet.privateKey);
    const transaction = { from: fromAddress, to: toAddress, amount, timestamp: Date.now() };
    const hash = SHA256(JSON.stringify(transaction)).toString();
    const signature = key.sign(hash).toDER('hex');
    
    return { ...transaction, signature, id: '', fee: 0 };
  },
});
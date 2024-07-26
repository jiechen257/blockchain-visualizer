import SHA256 from 'crypto-js/sha256';
import { Block, Transaction } from '../store/types';

// 计算区块的哈希值
export function calculateHash(block: Block): string {
  return SHA256(
    block.index +
    block.previousHash +
    block.timestamp +
    JSON.stringify(block.transactions) +
    block.nonce
  ).toString();
}

// 创建新的区块
export function createNewBlock(previousBlock: Block, transactions: Transaction[] = []): Block {
  const newBlock: Block = {
    index: previousBlock.index + 1,
    timestamp: Date.now(),
    transactions: transactions,
    previousHash: previousBlock.hash,
    hash: '',
    nonce: 0,
  };
  newBlock.hash = calculateHash(newBlock);
  return newBlock;
}

// 挖矿（工作量证明）
export function mineBlock(block: Block, difficulty: number): Block {
  const target = Array(difficulty + 1).join("0");
  while (block.hash.substring(0, difficulty) !== target) {
    block.nonce++;
    block.hash = calculateHash(block);
  }
  return block;
}

// 验证区块是否有效
export function isValidBlock(block: Block, previousBlock: Block): boolean {
  if (block.index !== previousBlock.index + 1) {
    return false;
  }
  if (block.previousHash !== previousBlock.hash) {
    return false;
  }
  if (calculateHash(block) !== block.hash) {
    return false;
  }
  return true;
}

// 验证整个区块链是否有效
export function isValidChain(blockchain: Block[]): boolean {
  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];

    if (!isValidBlock(currentBlock, previousBlock)) {
      return false;
    }
  }
  return true;
}

// 创建创世区块
export function createGenesisBlock(): Block {
  return {
    index: 0,
    timestamp: Date.now(),
    transactions: [],
    previousHash: "0",
    hash: "",
    nonce: 0
  };
}

// 计算交易的哈希值（用于签名）
export function calculateTransactionHash(transaction: Omit<Transaction, 'id' | 'signature'>): string {
  return SHA256(
    transaction.from +
    transaction.to +
    transaction.amount +
    transaction.fee +
    transaction.timestamp
  ).toString();
}
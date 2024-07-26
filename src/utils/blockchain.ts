import SHA256 from 'crypto-js/sha256';

// 计算区块哈希值
export const calculateHash = (index: number, previousHash: string, timestamp: number, data: any, nonce: number): string => {
  return SHA256(index + previousHash + timestamp + JSON.stringify(data) + nonce).toString();
};

// 挖掘新区块
export const mineBlock = (block: any, difficulty: number): any => {
  while (block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
    block.nonce++;
    block.hash = calculateHash(block.index, block.previousHash, block.timestamp, block.transactions, block.nonce);
  }
  return block;
};

// 验证区块链
export const isValidChain = (blockchain: any[]): boolean => {
  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];

    if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    }

    if (currentBlock.hash !== calculateHash(currentBlock.index, currentBlock.previousHash, currentBlock.timestamp, currentBlock.transactions, currentBlock.nonce)) {
      return false;
    }
  }
  return true;
};
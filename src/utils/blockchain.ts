import SHA256 from 'crypto-js/sha256';

export const calculateHash = (index: number, previousHash: string, timestamp: number, data: any, nonce: number): string => {
  return SHA256(index + previousHash + timestamp + JSON.stringify(data) + nonce).toString();
};

export const mineBlock = (block: any, difficulty: number): any => {
  while (block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
    block.nonce++;
    block.hash = calculateHash(block.index, block.previousHash, block.timestamp, block.transactions, block.nonce);
  }
  return block;
};
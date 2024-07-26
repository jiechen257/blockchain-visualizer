import React from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';
import { mineBlock, calculateHash } from '../utils/blockchain';

const BlockMining: React.FC = () => {
  const { blockchain, pendingTransactions, addBlock } = useBlockchainStore();

  const handleMineBlock = () => {
    const previousBlock = blockchain[blockchain.length - 1];
    const newBlock = {
      index: blockchain.length,
      timestamp: Date.now(),
      transactions: pendingTransactions,
      previousHash: previousBlock ? previousBlock.hash : '0',
      hash: '',
      nonce: 0,
    };

    const minedBlock = mineBlock(newBlock, 4); // Difficulty set to 4
    addBlock(minedBlock);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Block Mining</h2>
      <button onClick={handleMineBlock} className="bg-yellow-500 text-white px-4 py-2 rounded">
        Mine New Block
      </button>
      <div className="mt-4">
        <h3 className="font-bold">Blockchain:</h3>
        {blockchain.map((block) => (
          <div key={block.hash} className="mt-2">
            <span>Block {block.index}</span>: <span>{block.hash}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockMining;
import React from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';

const BlockDetails: React.FC = () => {
  const { blockchain } = useBlockchainStore();
  const [selectedBlock, setSelectedBlock] = React.useState<number | null>(null);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">区块详情</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <select 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
            onChange={(e) => setSelectedBlock(Number(e.target.value))}
            value={selectedBlock === null ? '' : selectedBlock}
          >
            <option value="">选择一个区块</option>
            {blockchain.map((block, index) => (
              <option key={block.hash} value={index}>区块 {block.index}</option>
            ))}
          </select>
          {selectedBlock !== null && (
            <div className="mt-4 h-64 overflow-y-auto">
              <pre className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
                {JSON.stringify(blockchain[selectedBlock], null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockDetails;
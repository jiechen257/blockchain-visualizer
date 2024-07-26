import React, { useState } from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';

const BlockMining: React.FC = () => {
  const { blockchain, wallets, minePendingTransactions } = useBlockchainStore();
  const [miningRewardAddress, setMiningRewardAddress] = useState('');

  const handleMineBlock = () => {
    if (miningRewardAddress) {
      minePendingTransactions(miningRewardAddress);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">区块挖掘</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-4">
            <label htmlFor="miningRewardAddress" className="block text-sm font-medium text-gray-700">挖矿奖励地址</label>
            <select
              id="miningRewardAddress"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
              value={miningRewardAddress}
              onChange={(e) => setMiningRewardAddress(e.target.value)}
            >
              <option value="">选择钱包</option>
              {wallets.map((wallet) => (
                <option key={wallet.address} value={wallet.address}>
                  {wallet.address} ({wallet.balance} 币)
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleMineBlock}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            挖掘新区块
          </button>
          <div className="mt-4">
            <h4 className="font-bold">区块链:</h4>
            <ul className="mt-2 space-y-2">
              {blockchain.map((block) => (
                <li key={block.hash} className="text-sm">
                  <span className="font-medium">区块 {block.index}:</span>{' '}
                  <span className="truncate inline-block max-w-xs" title={block.hash}>
                    {block.hash}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockMining;
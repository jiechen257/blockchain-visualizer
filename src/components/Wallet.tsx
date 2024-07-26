import React, { useState } from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';

const Wallet: React.FC = () => {
  const [address, setAddress] = useState('');
  const { wallets, addWallet } = useBlockchainStore();

  const handleCreateWallet = () => {
    const newWallet = { address: `0x${Math.random().toString(36).substr(2, 9)}`, balance: 100 };
    addWallet(newWallet);
    setAddress('');
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Wallet Management</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <button
            onClick={handleCreateWallet}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Wallet
          </button>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500">Wallets:</h4>
            <ul className="mt-2 divide-y divide-gray-200">
              {wallets.map((wallet) => (
                <li key={wallet.address} className="py-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900 truncate">{wallet.address}</div>
                    <div className="ml-2 text-sm text-gray-500">{wallet.balance} coins</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
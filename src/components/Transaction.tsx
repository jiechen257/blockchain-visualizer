import React, { useState } from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';

const Transaction: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const { wallets, addTransaction, updateWalletBalance } = useBlockchainStore();

  const handleTransaction = () => {
    if (from && to && amount > 0 && fee >= 0) {
      const transaction = { 
        from, 
        to, 
        amount, 
        fee, 
        timestamp: Date.now() 
      };
      addTransaction(transaction);
      updateWalletBalance(from, -(amount + fee));
      updateWalletBalance(to, amount);
      setFrom('');
      setTo('');
      setAmount(0);
      setFee(0);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">创建交易</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700">从</label>
              <select
                id="from"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                <option value="">选择发送钱包</option>
                {wallets.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {wallet.address} ({wallet.balance} 币)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">到</label>
              <select
                id="to"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                <option value="">选择接收钱包</option>
                {wallets.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {wallet.address} ({wallet.balance} 币)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">金额</label>
              <input
                type="number"
                id="amount"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="fee" className="block text-sm font-medium text-gray-700">手续费</label>
              <input
                type="number"
                id="fee"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
              />
            </div>
            <div>
              <button
                onClick={handleTransaction}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                发送交易
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
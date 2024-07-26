import React, { useState } from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';

const Transaction: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const { wallets, addTransaction, updateWalletBalance } = useBlockchainStore();

  const handleTransaction = () => {
    if (from && to && amount > 0) {
      const transaction = { from, to, amount };
      addTransaction(transaction);
      updateWalletBalance(from, -amount);
      updateWalletBalance(to, amount);
      setFrom('');
      setTo('');
      setAmount(0);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Transaction</h2>
      <div className="mb-2">
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Select From Wallet</option>
          {wallets.map((wallet) => (
            <option key={wallet.address} value={wallet.address}>
              {wallet.address} ({wallet.balance} coins)
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Select To Wallet</option>
          {wallets.map((wallet) => (
            <option key={wallet.address} value={wallet.address}>
              {wallet.address} ({wallet.balance} coins)
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
          className="w-full p-2 border rounded"
        />
      </div>
      <button onClick={handleTransaction} className="bg-green-500 text-white px-4 py-2 rounded">
        Send Transaction
      </button>
    </div>
  );
};

export default Transaction;
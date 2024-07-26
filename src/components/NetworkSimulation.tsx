import React, { useState, useEffect } from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';

const NetworkSimulation: React.FC = () => {
  const { wallets, addTransaction } = useBlockchainStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1000);

  // 模拟网络交易
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        const fromWallet = wallets[Math.floor(Math.random() * wallets.length)];
        const toWallet = wallets[Math.floor(Math.random() * wallets.length)];
        if (fromWallet && toWallet && fromWallet !== toWallet) {
          const amount = Math.floor(Math.random() * 10) + 1;
          const fee = Math.floor(Math.random() * 2) + 1;
          if (fromWallet.balance >= amount + fee) {
            addTransaction({
              from: fromWallet.address,
              to: toWallet.address,
              amount,
              fee,
              timestamp: Date.now(),
            });
          }
        }
      }, simulationSpeed);
    }
    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, wallets, addTransaction]);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">网络模拟</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isSimulating ? '停止模拟' : '开始模拟'}
            </button>
            <div className="flex items-center">
              <label htmlFor="simulation-speed" className="mr-2 text-sm font-medium text-gray-700">
                速度 (毫秒):
              </label>
              <input
                type="number"
                id="simulation-speed"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                min="100"
                step="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSimulation;
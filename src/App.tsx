import React from 'react';
import Layout from './components/Layout';
import Wallet from './components/Wallet';
import Transaction from './components/Transaction';
import BlockMining from './components/BlockMining';
import BlockchainVisualization from './components/BlockchainVisualization';
import BlockDetails from './components/BlockDetails';
import NetworkSimulation from './components/NetworkSimulation';
import TransactionPool from './components/TransactionPool';
import BlockchainForkVisualization from './components/BlockchainForkVisualization';
import MinerSimulation from './components/MinerSimulation';
import Tutorial from './components/Tutorial';

const App: React.FC = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Wallet />
          <Transaction />
          <TransactionPool />
        </div>
        <div className="space-y-6">
          <BlockMining />
          <BlockDetails />
          <MinerSimulation />
        </div>
      </div>
      <div className="mt-6 space-y-6">
        <NetworkSimulation />
        <BlockchainVisualization />
        <BlockchainForkVisualization />
        <Tutorial />
      </div>
    </Layout>
  );
};

export default App;
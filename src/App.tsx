import React from 'react';
import Layout from './components/Layout';
import Wallet from './components/Wallet';
import Transaction from './components/Transaction';
import BlockMining from './components/BlockMining';
import BlockchainVisualization from './components/BlockchainVisualization';

const App: React.FC = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Wallet />
          <Transaction />
        </div>
        <div className="space-y-4">
          <BlockMining />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Blockchain Visualization</h2>
        <BlockchainVisualization />
      </div>
    </Layout>
  );
};

export default App;
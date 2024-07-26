import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Wallet from './components/Wallet';
import Transaction from './components/Transaction';
import BlockMining from './components/BlockMining';
import BlockchainVisualization from './components/BlockchainVisualization';
import BlockDetails from './components/BlockDetails';
import NetworkSimulation from './components/NetworkSimulation';
import BlockchainForkVisualization from './components/BlockchainForkVisualization';
import Tutorial from './components/Tutorial';

const App: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    setShowTutorial(false);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="h-[400px]">
            <Wallet />
          </div>
          <Transaction />
        </div>
        <div className="space-y-6">
          <div className="h-[400px]">
            <BlockMining />
          </div>
          <BlockDetails />
        </div>
      </div>
      <div className="mt-6 space-y-6">
        <NetworkSimulation />
        <BlockchainVisualization />
        <BlockchainForkVisualization />
      </div>
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
    </Layout>
  );
};

export default App;
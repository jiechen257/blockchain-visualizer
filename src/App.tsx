import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import DashboardHero from './components/dashboard/DashboardHero';
import SystemStatCards from './components/dashboard/SystemStatCards';
import QuickActions from './components/dashboard/QuickActions';
import Wallet from './components/Wallet';
import Transaction from './components/Transaction';
import BlockMining from './components/BlockMining';
import BlockchainVisualization from './components/BlockchainVisualization';
import BlockDetails from './components/BlockDetails';
import NetworkSimulation from './components/NetworkSimulation';
import BlockchainForkVisualization from './components/BlockchainForkVisualization';
import Tutorial from './components/Tutorial';
import QuickStartChecklist from './components/dashboard/QuickStartChecklist';
import RecentActivityFeed from './components/dashboard/RecentActivityFeed';

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
      <div className="space-y-8">
        <DashboardHero />
        <SystemStatCards />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">快速开始</h3>
            <p className="text-sm text-slate-600">按推荐顺序完成核心交互流程</p>
          </div>

          <QuickActions />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-7">
              <div className="h-[360px] md:h-[420px] w-full">
                <Wallet />
              </div>
              <Transaction />
            </div>
            <div className="space-y-6 xl:col-span-5">
              <div className="h-[360px] md:h-[420px] w-full">
                <BlockMining />
              </div>
              <QuickStartChecklist />
              <RecentActivityFeed />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">网络模拟入口</h3>
            <p className="text-sm text-slate-600">保留自动交易模拟入口，避免相对基线能力回退</p>
          </div>
          <NetworkSimulation />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">主链舞台</h3>
            <p className="text-sm text-slate-600">聚焦主链演进、分叉状态与区块结构化视图</p>
          </div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
              <BlockchainVisualization />
              <BlockchainForkVisualization />
            </div>
            <div className="xl:col-span-4">
              {/* 先复用现有区块详情，作为 StructuredBlockDetails 的稳定插槽。 */}
              <BlockDetails />
            </div>
          </div>
        </section>
      </div>
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
    </Layout>
  );
};

export default App;

import React from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BlockchainForkVisualization: React.FC = () => {
  const { chains, addChain, resolveChainFork } = useBlockchainStore();

  const handleCreateFork = () => {
    const mainChain = chains.find(chain => chain.isMain);
    if (mainChain) {
      const forkPoint = Math.floor(mainChain.blocks.length / 2);
      const newChain = mainChain.blocks.slice(0, forkPoint);
      addChain(newChain);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块链分叉可视化</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleCreateFork}>创建分叉</Button>
          <Button onClick={resolveChainFork}>解决分叉</Button>
          <div className="space-y-2">
            {chains.map((chain) => (
              <div key={chain.id} className={`p-2 border rounded ${chain.isMain ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <h3 className="font-bold">{chain.isMain ? '主链' : '分叉链'}</h3>
                <p>区块数: {chain.blocks.length}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainForkVisualization;
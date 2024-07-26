import React, { useState, useEffect } from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const NetworkSimulation: React.FC = () => {
  const { wallets, addTransaction } = useBlockchainStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1000);

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
    <Card>
      <CardHeader>
        <CardTitle>网络模拟</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="simulation-switch"
              checked={isSimulating}
              onCheckedChange={setIsSimulating}
            />
            <Label htmlFor="simulation-switch">
              {isSimulating ? '停止模拟' : '开始模拟'}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="simulation-speed">速度 (毫秒):</Label>
            <Input
              id="simulation-speed"
              type="number"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              min="100"
              step="100"
              className="w-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkSimulation;
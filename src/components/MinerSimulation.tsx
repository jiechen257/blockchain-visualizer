import React, { useState } from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MinerSimulation: React.FC = () => {
  const { miners, addMiner, removeMiner, simulateMining } = useBlockchainStore();
  const [minerName, setMinerName] = useState('');
  const [hashPower, setHashPower] = useState(10);
  const [strategy, setStrategy] = useState<'honest' | 'selfish'>('honest');

  const handleAddMiner = () => {
    if (minerName) {
      addMiner({ name: minerName, hashPower, strategy });
      setMinerName('');
      setHashPower(10);
      setStrategy('honest');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>矿工模拟</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input 
              placeholder="矿工名称" 
              value={minerName} 
              onChange={(e) => setMinerName(e.target.value)} 
            />
            <Input 
              type="number" 
              placeholder="算力" 
              value={hashPower} 
              onChange={(e) => setHashPower(Number(e.target.value))} 
            />
            <Select value={strategy} onValueChange={(value: 'honest' | 'selfish') => setStrategy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="策略" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="honest">诚实</SelectItem>
                <SelectItem value="selfish">自私</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddMiner}>添加矿工</Button>
          </div>
          <Button onClick={simulateMining}>模拟挖矿</Button>
          <div className="space-y-2">
            {miners.map((miner) => (
              <div key={miner.id} className="flex justify-between items-center p-2 border rounded">
                <span>{miner.name} (算力: {miner.hashPower}, 策略: {miner.strategy})</span>
                <Button variant="destructive" onClick={() => removeMiner(miner.id)}>移除</Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinerSimulation;
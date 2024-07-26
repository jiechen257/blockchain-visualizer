import React, { useState } from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const BlockMining: React.FC = () => {
  const { blockchain, wallets, minePendingTransactions } = useBlockchainStore();
  const [miningRewardAddress, setMiningRewardAddress] = useState('');

  const handleMineBlock = () => {
    if (miningRewardAddress) {
      minePendingTransactions(miningRewardAddress);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块挖掘</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="miningRewardAddress">挖矿奖励地址</Label>
            <Select onValueChange={setMiningRewardAddress} value={miningRewardAddress}>
              <SelectTrigger id="miningRewardAddress">
                <SelectValue placeholder="选择钱包" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.address} value={wallet.address}>
                    {wallet.address} ({wallet.balance} 币)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleMineBlock} className="w-full">
            挖掘新区块
          </Button>
          <div className="mt-4">
            <h4 className="font-bold mb-2">区块链:</h4>
            <ul className="space-y-2">
              {blockchain.map((block) => (
                <li key={block.hash} className="text-sm">
                  <span className="font-medium">区块 {block.index}:</span>{' '}
                  <span className="truncate inline-block max-w-xs" title={block.hash}>
                    {block.hash}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockMining;
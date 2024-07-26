import React, { useState } from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const Wallet: React.FC = () => {
  const { wallets, addWallet } = useBlockchainStore();

  const handleCreateWallet = () => {
    const newWallet = { address: `0x${Math.random().toString(36).substr(2, 9)}`, balance: 100 };
    addWallet(newWallet);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>钱包管理</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleCreateWallet}>创建新钱包</Button>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-muted-foreground">钱包列表:</h4>
          <ul className="mt-2 space-y-2">
            {wallets.map((wallet) => (
              <li key={wallet.address} className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">{wallet.address}</span>
                <span className="text-sm text-muted-foreground">{wallet.balance} 币</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Wallet;
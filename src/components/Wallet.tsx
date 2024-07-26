import React from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Wallet: React.FC = () => {
  const { wallets, createWallet } = useBlockchainStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>钱包管理</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={createWallet}>创建新钱包</Button>
        <div className="mt-4 space-y-4">
          {wallets.map((wallet) => (
            <div key={wallet.address} className="p-2 border rounded">
              <p><strong>地址:</strong> {wallet.address}</p>
              <p><strong>余额:</strong> {wallet.balance} 币</p>
              <p><strong>私钥:</strong> {wallet.privateKey.slice(0, 10)}...</p>
              <p><strong>公钥:</strong> {wallet.publicKey.slice(0, 10)}...</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Wallet;
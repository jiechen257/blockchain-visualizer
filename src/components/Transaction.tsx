import React, { useState } from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Transaction: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const { wallets, signTransaction, addPendingTransaction } = useBlockchainStore();

  const handleTransaction = () => {
    if (from && to && amount > 0 && fee >= 0) {
      const signedTransaction = signTransaction(from, to, amount);
      if (signedTransaction) {
        addPendingTransaction({ ...signedTransaction, fee });
        setFrom('');
        setTo('');
        setAmount(0);
        setFee(0);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>创建交易</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from">从</Label>
            <Select onValueChange={setFrom} value={from}>
              <SelectTrigger id="from">
                <SelectValue placeholder="选择发送钱包" />
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
          <div className="space-y-2">
            <Label htmlFor="to">到</Label>
            <Select onValueChange={setTo} value={to}>
              <SelectTrigger id="to">
                <SelectValue placeholder="选择接收钱包" />
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
          <div className="space-y-2">
            <Label htmlFor="amount">金额</Label>
            <Input 
              id="amount" 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee">手续费</Label>
            <Input 
              id="fee" 
              type="number" 
              value={fee} 
              onChange={(e) => setFee(Number(e.target.value))}
            />
          </div>
          <Button onClick={handleTransaction} className="w-full">
            发送交易
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Transaction;
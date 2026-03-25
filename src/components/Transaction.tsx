// src/components/Transaction.tsx

import React, { useState } from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WalletSelect from './WalletSelect';

const Transaction: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signTransaction, addPendingTransaction, wallets, focusedAction, setFocusedAction } = useBlockchainStore();

  const handleTransaction = () => {
    setError(null);
    setSuccessMessage(null);

    if (!from || !to || from === to) {
      setError('请选择有效的钱包组合');
      return;
    }

    if (amount <= 0) {
      setError('请输入大于 0 的交易金额');
      return;
    }

    if (fee < 0) {
      setError('手续费不能小于 0');
      return;
    }

    const sender = wallets.find((wallet) => wallet.address === from);
    if (!sender || sender.balance < amount + fee) {
      setError('发送方余额不足以覆盖金额和手续费');
      return;
    }

    const signedTransaction = signTransaction(from, to, amount);
    if (!signedTransaction) {
      setError('交易签名失败，请重新选择钱包');
      return;
    }

    addPendingTransaction({ ...signedTransaction, fee });
    setSuccessMessage('交易已加入待确认池，现在可以去挖矿确认它');
    setFrom('');
    setTo('');
    setAmount(0);
    setFee(0);
    if (focusedAction === 'transaction') {
      setFocusedAction(null);
    }
  };

  return (
    <Card
      className={`rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70 ${
        focusedAction === 'transaction' ? 'ring-2 ring-cyan-300' : ''
      }`}
    >
      <CardHeader>
        <CardTitle className="text-xl">创建交易</CardTitle>
        <CardDescription>选择发送与接收钱包，交易提交后会进入待确认池，等待挖矿打包。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <WalletSelect
            value={from}
            onValueChange={setFrom}
            placeholder="选择发送钱包"
            label="从"
          />
          <WalletSelect
            value={to}
            onValueChange={setTo}
            placeholder="选择接收钱包"
            label="到"
          />
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
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <p className="font-medium">交易已加入待确认池</p>
              <p className="mt-1">现在可以去挖矿确认它</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Transaction;

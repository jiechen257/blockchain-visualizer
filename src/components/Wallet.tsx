import React from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const abbreviateAddress = (address: string) => `${address.slice(0, 8)}…${address.slice(-8)}`;

const Wallet: React.FC = () => {
  const { wallets, createWallet, setFocusedAction, setPreferredMinerAddress } = useBlockchainStore();
  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);

  const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">创建第一个钱包</p>
          <p className="text-sm text-slate-500">
            钱包用于接收资产并发起链上操作，先创建一个钱包即可开启探索。私钥由客户端保管，不会上传。
          </p>
          <Button size="lg" onClick={createWallet}>
            立即创建钱包
          </Button>
        </div>
  );

  const renderWalletCard = (wallet: { address: string; balance: number }, index: number) => {
    const addressLabel = abbreviateAddress(wallet.address);

    return (
        <div
          key={wallet.address}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm transition hover:shadow-lg"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">钱包#{index + 1}</p>
            <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500">
              可用资产
          </span>
        </div>
        <p className="text-2xl font-semibold text-slate-900">{wallet.balance} 币</p>
        <p className="text-sm font-medium text-slate-600">{addressLabel}</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setFocusedAction('transaction')}>
            用于发交易
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPreferredMinerAddress(wallet.address);
              setFocusedAction('mining');
            }}
          >
            设为挖矿奖励地址
          </Button>
        </div>
      </div>
    );
  };

  const showHeaderCTA = wallets.length > 0;

  return (
    <Card className="flex h-full flex-col rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">钱包管理</CardTitle>
        <CardDescription>管理你的资产，当前账户会在这里展示可用余额与入口。</CardDescription>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">钱包数量</p>
            <p className="text-2xl font-semibold text-slate-900">{wallets.length}</p>
          </div>
          {showHeaderCTA && (
            <Button onClick={createWallet}>创建新钱包</Button>
          )}
        </div>

        {wallets.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-cyan-500/10 to-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">总资产（合计）</p>
              <p className="text-3xl font-semibold text-slate-900">{totalBalance} 币</p>
              <p className="text-xs text-slate-500">{wallets.length} 个钱包正在运行</p>
            </div>
            <ScrollArea className="flex-1 rounded-2xl">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {wallets.map(renderWalletCard)}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Wallet;

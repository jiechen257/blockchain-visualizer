import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useBlockchainStore from '@/store/useBlockchainStore'

const abbreviateAddress = (address: string) => `${address.slice(0, 8)}...${address.slice(-6)}`

const Wallet: React.FC = () => {
  const {
    wallets,
    createWallet,
    setFocusedAction,
    setPreferredMinerAddress,
    syncGuideFromState,
    activeMode,
  } = useBlockchainStore()

  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0)

  const handleCreateWallet = () => {
    createWallet()
    syncGuideFromState()

    if (activeMode === 'guided') {
      setFocusedAction('transaction')
    }
  }

  return (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">钱包管理</CardTitle>
        <CardDescription>自由实验里先准备参与者，再把某个地址指定为发送方或挖矿奖励地址。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">实验摘要</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{wallets.length} 个钱包</p>
              <p className="mt-1 text-sm text-slate-600">总资产 {totalBalance} 币</p>
            </div>
            <Button onClick={handleCreateWallet}>创建新钱包</Button>
          </div>
        </div>

        {wallets.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-4 py-6 text-sm leading-6 text-slate-600">
            创建至少两个钱包后，就可以在同一套主舞台里重复观察“钱包发起交易 -&gt; 节点接收 -&gt; 矿工打包”的完整过程。
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.map((wallet, index) => (
              <div key={wallet.address} className="rounded-[22px] border border-slate-200 bg-white px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">钱包 #{index + 1}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{abbreviateAddress(wallet.address)}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {wallet.balance} 币
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setFocusedAction('transaction')}>
                    用于发交易
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPreferredMinerAddress(wallet.address)
                      setFocusedAction('mining')
                    }}
                  >
                    设为挖矿奖励地址
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-[24px] border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
          钱包卡只保留这次学习需要的动作，不再承担旧页面那种完整资产控制台的角色。
        </div>
      </CardContent>
    </Card>
  )
}

export default Wallet

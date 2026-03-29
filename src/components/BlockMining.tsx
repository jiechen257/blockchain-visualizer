import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useBlockchainStore from '@/store/useBlockchainStore'
import { createNewBlock, mineBlock } from '@/utils/blockchain'
import WalletSelect from './WalletSelect'

const BlockMining: React.FC = () => {
  const {
    chains,
    addBlockToChain,
    pendingTransactions,
    removePendingTransaction,
    wallets,
    preferredMinerAddress,
    setPreferredMinerAddress,
    focusedAction,
    setFocusedAction,
    syncGuideFromState,
  } = useBlockchainStore()

  const [miningRewardAddress, setMiningRewardAddress] = useState(preferredMinerAddress ?? '')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'mining' | 'success' | 'error'>('idle')
  const [resultSummary, setResultSummary] = useState<string | null>(null)

  useEffect(() => {
    if (preferredMinerAddress) {
      setMiningRewardAddress(preferredMinerAddress)
    }
  }, [preferredMinerAddress])

  const mainChain = chains.find((chain) => chain.isMain)
  const latestBlock = mainChain?.blocks.at(-1)

  const handleMineBlock = () => {
    setError(null)
    setResultSummary(null)
    setStatus('mining')

    if (!miningRewardAddress) {
      setError('请选择一个钱包来接收挖矿奖励')
      setStatus('error')
      return
    }

    if (!mainChain) {
      setError('找不到主链')
      setStatus('error')
      return
    }

    try {
      const transactionsToMine = pendingTransactions.slice(0, 5)
      const previousBlock = mainChain.blocks[mainChain.blocks.length - 1]

      if (!previousBlock) {
        const genesisBlock = createNewBlock(
          {
            index: -1,
            hash: '0',
            timestamp: 0,
            transactions: [],
            previousHash: '0',
            nonce: 0,
          },
          transactionsToMine
        )
        const minedGenesisBlock = mineBlock(genesisBlock, 4)
        addBlockToChain(mainChain.id, minedGenesisBlock)
        transactionsToMine.forEach((tx) => removePendingTransaction(tx.id))
      } else {
        const newBlock = createNewBlock(previousBlock)
        newBlock.transactions = transactionsToMine
        const minedBlock = mineBlock(newBlock, 4)
        addBlockToChain(mainChain.id, minedBlock)
        transactionsToMine.forEach((tx) => removePendingTransaction(tx.id))
      }

      const minerWallet = wallets.find((wallet) => wallet.address === miningRewardAddress)
      if (minerWallet) {
        // 通过 store 更新奖励地址余额，确保钱包动作卡和主舞台状态一起刷新。
        useBlockchainStore.setState((state) => ({
          wallets: state.wallets.map((wallet) =>
            wallet.address === miningRewardAddress ? { ...wallet, balance: wallet.balance + 10 } : wallet
          ),
        }))
      }

      setPreferredMinerAddress(miningRewardAddress)
      setStatus('success')
      setResultSummary(
        transactionsToMine.length === 0
          ? '本次挖出的是空块，但主链高度仍然会增加'
          : `本次已打包 ${transactionsToMine.length} 笔交易，并发放 10 币挖矿奖励`
      )

      if (focusedAction === 'mining') {
        setFocusedAction(null)
      }

      syncGuideFromState()
    } catch (err) {
      console.error('挖矿过程中出错:', err)
      setError('挖矿过程中出错，请查看控制台以获取更多信息')
      setStatus('error')
    }
  }

  return (
    <Card
      className={`rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70 ${
        focusedAction === 'mining' ? 'ring-2 ring-cyan-300' : ''
      }`}
    >
      <CardHeader>
        <CardTitle className="text-xl">区块挖掘</CardTitle>
        <CardDescription>自由实验里用一次挖矿动作，把交易从交易池推进到候选区块，再推进到主链确认。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">待打包交易</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{pendingTransactions.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">奖励地址</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {miningRewardAddress ? `${miningRewardAddress.slice(0, 8)}...` : '尚未选择'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">挖矿状态</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {status === 'idle' && '等待开始'}
              {status === 'mining' && '处理中'}
              {status === 'success' && '已完成'}
              {status === 'error' && '发生错误'}
            </p>
          </div>
        </div>

        <WalletSelect
          value={miningRewardAddress}
          onValueChange={(value) => {
            setMiningRewardAddress(value)
            setPreferredMinerAddress(value)
          }}
          placeholder="选择钱包"
          label="挖矿奖励地址"
        />

        <Button onClick={handleMineBlock}>挖掘新区块</Button>

        {error && <p className="text-red-500">{error}</p>}

        {resultSummary && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {resultSummary}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">最新主链摘要</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {latestBlock ? `区块 ${latestBlock.index}` : '还没有新的区块'}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {latestBlock
                ? `当前链高 ${mainChain?.blocks.length ?? 0}，最近一个区块包含 ${latestBlock.transactions.length} 笔交易。`
                : '当矿工找到满足条件的哈希后，这里会显示新的主链结果。'}
            </p>
          </div>

          <div className="rounded-[24px] border border-cyan-100 bg-cyan-50/70 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-700">观察提示</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              V1 重点不是展示整条链的所有细节，而是帮助你看懂 Nonce、Hash、候选区块和主链确认之间的因果关系。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BlockMining

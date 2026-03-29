import useBlockchainStore from '@/store/useBlockchainStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const fieldClassName = 'grid gap-1 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3'

export default function StructuredBlockDetails() {
  const { chains, selectedBlockHash } = useBlockchainStore((state) => ({
    chains: state.chains,
    selectedBlockHash: state.selectedBlockHash,
  }))

  const mainChain = chains.find((chain) => chain.isMain)
  // 区块详情需要同时支持主链与分叉链选中态，而不是只在主链里查找。
  const selectedChain = selectedBlockHash
    ? chains.find((chain) => chain.blocks.some((block) => block.hash === selectedBlockHash))
    : mainChain
  const selectedBlock =
    selectedChain?.blocks.find((block) => block.hash === selectedBlockHash) ??
    mainChain?.blocks.at(-1)
  const selectedChainLabel = selectedChain
    ? selectedChain.isMain
      ? '主链'
      : '分叉链'
    : '未选择'

  return (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">结构化区块详情</CardTitle>
        <CardDescription>点击主链或分叉链上的区块按钮后，这里会同步展示关键字段。</CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedBlock ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            当前还没有区块。先完成一次挖矿，再返回这里查看结构化详情。
          </div>
        ) : (
          <dl className="grid gap-3">
            <div className={fieldClassName}>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">所属链</dt>
              <dd className="text-sm font-medium text-slate-900">{selectedChainLabel}</dd>
            </div>
            <div className={fieldClassName}>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">区块高度</dt>
              <dd className="text-sm font-medium text-slate-900">{selectedBlock.index}</dd>
            </div>
            <div className={fieldClassName}>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">哈希</dt>
              <dd className="break-all text-sm font-medium text-slate-900">{selectedBlock.hash}</dd>
            </div>
            <div className={fieldClassName}>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">前序哈希</dt>
              <dd className="break-all text-sm font-medium text-slate-900">{selectedBlock.previousHash}</dd>
            </div>
            <div className={fieldClassName}>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">交易数量</dt>
              <dd className="text-sm font-medium text-slate-900">{selectedBlock.transactions.length}</dd>
            </div>
            <div className={fieldClassName}>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">时间戳</dt>
              <dd className="text-sm font-medium text-slate-900">
                {new Date(selectedBlock.timestamp).toLocaleString()}
              </dd>
            </div>
            <div className={fieldClassName}>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Nonce</dt>
              <dd className="text-sm font-medium text-slate-900">{selectedBlock.nonce}</dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  )
}

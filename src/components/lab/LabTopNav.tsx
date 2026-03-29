import { Button } from '@/components/ui/button'
import useBlockchainStore from '@/store/useBlockchainStore'

const tabs = [
  { key: 'guided', label: '主线引导' },
  { key: 'sandbox', label: '自由实验' },
  { key: 'advanced', label: '进阶实验' },
  { key: 'glossary', label: '术语索引' },
] as const

export default function LabTopNav() {
  const { activeMode, setActiveMode } = useBlockchainStore((state) => ({
    activeMode: state.activeMode,
    setActiveMode: state.setActiveMode,
  }))

  return (
    <section className="rounded-[30px] border border-slate-200/80 bg-white/85 p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
            Blockchain Learning Lab
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            区块链协同实验室
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            不再从功能卡片开始，而是沿着“一笔交易如何穿过钱包、节点、矿工并最终写入主链”来理解系统协同。
          </p>
        </div>
        <div
          role="tablist"
          aria-label="学习模式"
          className="flex flex-wrap gap-2"
        >
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              role="tab"
              aria-selected={activeMode === tab.key}
              variant={activeMode === tab.key ? 'default' : 'outline'}
              onClick={() => setActiveMode(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import useBlockchainStore from '@/store/useBlockchainStore'
import { selectGuidePanel } from '@/store/labSelectors'
import LabPlaybackControls from './LabPlaybackControls'

export default function LabTaskPanel() {
  const panel = useBlockchainStore(selectGuidePanel)
  const { createWallet, setActiveMode, setFocusedAction, syncGuideFromState } = useBlockchainStore((state) => ({
    createWallet: state.createWallet,
    setActiveMode: state.setActiveMode,
    setFocusedAction: state.setFocusedAction,
    syncGuideFromState: state.syncGuideFromState,
  }))

  const handleCreateLearningWallet = () => {
    createWallet()
    syncGuideFromState()
    setFocusedAction('transaction')
  }

  return (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">当前任务</CardTitle>
        <CardDescription>{panel.modeLabel}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-[26px] border border-cyan-100 bg-[linear-gradient(180deg,_rgba(236,254,255,0.95)_0%,_rgba(255,255,255,0.95)_100%)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">{panel.chapter}</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{panel.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{panel.summary}</p>
        </div>

        <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-white p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">下一步操作</p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-900">{panel.nextAction}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">为什么会这样</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{panel.explanation}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">钱包数</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{panel.walletCount}</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">待确认交易</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{panel.pendingCount}</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">关键术语</p>
          <div className="mt-3 grid gap-3">
            {panel.terms.map((item) => (
              <div key={item.term} className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{item.term}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">主线控制</p>
          <div className="mt-3">
            <LabPlaybackControls />
          </div>
        </div>

        {panel.isComplete ? (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">主线完成</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              这条引导主线已经闭环完成。你可以继续重复实验，也可以切到进阶实验观察更复杂的链上竞争。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setActiveMode('sandbox')}>
                继续自由实验
              </Button>
              <Button size="sm" variant="outline" onClick={() => setActiveMode('advanced')}>
                进入进阶实验
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleCreateLearningWallet}>
              创建学习钱包
            </Button>
            <Button size="sm" variant="outline" onClick={() => setActiveMode('sandbox')}>
              切换到自由实验
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

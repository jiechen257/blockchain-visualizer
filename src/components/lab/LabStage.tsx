import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useBlockchainStore from '@/store/useBlockchainStore'
import { selectStageSnapshot } from '@/store/labSelectors'

const actorToneMap = {
  wallet: 'border-cyan-300 bg-cyan-50/80',
  node: 'border-amber-300 bg-amber-50/80',
  miner: 'border-emerald-300 bg-emerald-50/80',
  chain: 'border-slate-900 bg-slate-100',
} as const

export default function LabStage() {
  const stage = useBlockchainStore(selectStageSnapshot)
  const { wallets, setSelectedEntity } = useBlockchainStore((state) => ({
    wallets: state.wallets,
    setSelectedEntity: state.setSelectedEntity,
  }))

  const selectActor = (actor: 'wallet' | 'node' | 'miner' | 'chain') => {
    if (actor === 'wallet' && wallets[0]) {
      setSelectedEntity({ type: 'wallet', id: wallets[0].address })
      return
    }

    if (actor === 'chain' && stage.latestBlock) {
      setSelectedEntity({ type: 'block', id: stage.latestBlock.hash })
      return
    }

    if (actor === 'node') {
      setSelectedEntity({ type: 'node', id: 'node-1' })
      return
    }

    if (actor === 'miner') {
      setSelectedEntity({ type: 'miner', id: 'miner-1' })
      return
    }

    setSelectedEntity(null)
  }

  const actorClassName = (actor: 'wallet' | 'node' | 'miner' | 'chain') =>
    [
      'flex min-h-[172px] flex-col justify-between rounded-[28px] border p-5 text-left transition',
      stage.highlightedActor === actor ? actorToneMap[actor] : 'border-slate-200 bg-white/80',
    ].join(' ')

  const activeRouteItem = stage.routeItems[stage.activeRouteIndex]

  return (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">系统协同主舞台</CardTitle>
        <CardDescription>
          这里统一展示钱包、节点、矿工与主链如何围绕同一笔交易协作，而不是继续平铺独立功能块。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.7fr)_320px]">
          <div className="rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.16),_transparent_48%),linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(248,250,252,0.98)_100%)] p-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">当前系统正在发生什么</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{stage.headline}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{stage.description}</p>
              </div>
              <div className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
                {stage.tokenLabel}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-slate-200 bg-white/80 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">系统流转路径</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    点击任一角色，就能在右侧查看它为什么进入当前状态，以及下一步会影响谁。
                  </p>
                </div>
                <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 lg:inline-flex">
                  当前焦点：{activeRouteItem.pathLabel}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-stretch">
                {stage.routeItems.map((item, index) => {
                  const isDone = index < stage.activeRouteIndex
                  const isCurrent = index === stage.activeRouteIndex

                  return (
                    <div key={item.actor} className="flex flex-1 items-center gap-3">
                      <button
                        type="button"
                        className={actorClassName(item.actor)}
                        onClick={() => selectActor(item.actor)}
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                            {index + 1}. 系统角色
                          </p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">{item.title}</p>
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm leading-6 text-slate-600">{item.detail}</p>
                          <span
                            className={[
                              'inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium',
                              isCurrent
                                ? 'bg-cyan-600 text-white'
                                : isDone
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500',
                            ].join(' ')}
                          >
                            {isCurrent ? '当前焦点' : isDone ? '已经过' : '即将进入'}
                          </span>
                        </div>
                      </button>
                      {index < stage.routeItems.length - 1 && (
                        <span className="hidden text-2xl text-slate-300 xl:inline-flex">→</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)]">
              <div className="rounded-[26px] border border-slate-200 bg-slate-950 text-white">
                <div className="border-b border-white/10 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">协同信号卡</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.8)]" />
                    <p className="text-lg font-semibold">{activeRouteItem.pathLabel}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{activeRouteItem.detail}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">当前路径</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {stage.routeItems.map((item, index) => (
                      <div key={item.actor} className="flex items-center gap-2">
                        <span
                          className={[
                            'rounded-full border px-3 py-1 text-sm',
                            index === stage.activeRouteIndex
                              ? 'border-cyan-300 bg-cyan-400/15 text-cyan-100'
                              : index < stage.activeRouteIndex
                                ? 'border-emerald-300 bg-emerald-400/15 text-emerald-100'
                                : 'border-white/15 bg-white/5 text-slate-300',
                          ].join(' ')}
                        >
                          {item.pathLabel}
                        </span>
                        {index < stage.routeItems.length - 1 && <span className="text-slate-500">→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">舞台为什么只显示这些</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  主舞台只保留当前步骤相关的角色与因果，避免再次回到旧产品那种把钱包、交易、挖矿、链图同时铺满的控制台视角。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">本步观察重点</p>
              <ul className="mt-3 space-y-2">
                {stage.observations.map((item) => (
                  <li
                    key={item}
                    className="rounded-[18px] border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-600"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">点击角色后会发生什么</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                右侧不会只展示字段，而会解释对象当前状态、进入原因以及它接下来会推动谁发生变化。
              </p>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-cyan-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">主线节奏</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                用底部时间线定位阶段，用左侧任务面板控制节奏，用这里观察多角色协同，不再把注意力切碎到独立功能卡片里。
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

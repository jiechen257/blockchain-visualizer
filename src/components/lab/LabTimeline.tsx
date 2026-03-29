import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useBlockchainStore from '@/store/useBlockchainStore'
import { selectTimelineItems } from '@/store/labSelectors'

const statusClassMap = {
  done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  current: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  upcoming: 'border-slate-200 bg-white text-slate-500',
} as const

const statusTextMap = {
  done: '已走过',
  current: '当前阶段',
  upcoming: '即将进入',
} as const

export default function LabTimeline() {
  const items = useBlockchainStore(selectTimelineItems)

  return (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">交易生命周期</CardTitle>
        <CardDescription>
          底部时间线负责回答“这件事在整个系统流程里走到了哪一步”。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-3 lg:grid-cols-5">
          {items.map((item, index) => (
            <li key={item.key} className="relative">
              {index < items.length - 1 && (
                <span className="absolute left-[calc(50%+22px)] top-6 hidden h-px w-[calc(100%-44px)] bg-slate-200 lg:block" />
              )}
              <div
                className={`relative rounded-[24px] border px-4 py-4 ${statusClassMap[item.status as keyof typeof statusClassMap]}`}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-xs uppercase tracking-[0.24em]">阶段</p>
                </div>
                <p className="mt-3 text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs">{statusTextMap[item.status as keyof typeof statusTextMap]}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

import useBlockchainStore from '@/store/useBlockchainStore'
import { selectChecklist } from '@/store/dashboardSelectors'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function QuickStartChecklist() {
  const checklist = useBlockchainStore(selectChecklist)

  return (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">快速开始清单</CardTitle>
        <CardDescription>完成这三步，就能看到一条完整的链上交互闭环。</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {checklist.map((item, index) => (
            <li
              key={item.key}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">步骤 {index + 1}</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{item.label}</p>
              </div>
              <span
                className={
                  item.done
                    ? 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700'
                    : 'rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600'
                }
              >
                {item.done ? '已完成' : '待完成'}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

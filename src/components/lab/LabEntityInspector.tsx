import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useBlockchainStore from '@/store/useBlockchainStore'
import { selectInspectorState } from '@/store/labSelectors'

export default function LabEntityInspector() {
  const inspector = useBlockchainStore(selectInspectorState)

  return (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">对象详情</CardTitle>
        <CardDescription>{inspector.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">当前对象</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{inspector.title}</h3>
          <p className="mt-2 text-sm font-medium text-cyan-700">{inspector.status}</p>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">为什么会这样</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{inspector.reason}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">下一步会影响谁</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{inspector.nextEffect}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">关键字段</p>
          <ul className="mt-3 space-y-2">
            {inspector.facts.map((fact: string) => (
              <li key={fact} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

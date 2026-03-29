import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BlockchainForkVisualization from '@/components/BlockchainForkVisualization'
import NetworkSimulation from '@/components/NetworkSimulation'

export default function LabAdvancedExperiments() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
        <CardHeader>
          <CardTitle className="text-2xl">进阶实验</CardTitle>
          <CardDescription>
            这里承接主线之外的高阶主题，避免分叉和网络模拟过早干扰第一次学习主线。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">实验一</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">分叉实验</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              观察当两条链同时存在时，系统如何选择更长主链，并理解“分叉为何不会默认出现在主线首页”。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">实验二</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">网络模拟</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              用自动交易流作为进阶观察工具，而不是主线首页默认入口。
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <BlockchainForkVisualization />
        <NetworkSimulation />
      </div>
    </div>
  )
}

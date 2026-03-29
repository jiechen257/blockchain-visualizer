import useBlockchainStore from '@/store/useBlockchainStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const formatRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)

  if (minutes <= 0) {
    return '刚刚'
  }
  if (minutes < 60) {
    return `${minutes} 分钟前`
  }

  const hours = Math.floor(minutes / 60)
  return `${hours} 小时前`
}

export default function RecentActivityFeed() {
  const activityFeed = useBlockchainStore((state) => state.activityFeed)

  return (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">最近动态</CardTitle>
        <CardDescription>记录钱包、交易、挖矿、分叉与网络模拟等关键事件。</CardDescription>
      </CardHeader>
      <CardContent>
        {activityFeed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            暂无动态。完成一次创建钱包、发交易或挖矿操作后，这里会持续更新。
          </div>
        ) : (
          <ul className="space-y-3">
            {activityFeed.map((event) => (
              <li
                key={event.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                    {event.description && (
                      <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{formatRelativeTime(event.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

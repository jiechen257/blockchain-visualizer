import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Wallet from '@/components/Wallet'
import Transaction from '@/components/Transaction'
import BlockMining from '@/components/BlockMining'

export default function LabSandboxControls() {
  return (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">自由实验控件</CardTitle>
        <CardDescription>
          动作控件只在自由实验里完整展开，方便重复创建钱包、发交易、挖矿并观察舞台变化。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-3">
          <Wallet />
          <Transaction />
          <BlockMining />
        </div>
      </CardContent>
    </Card>
  )
}

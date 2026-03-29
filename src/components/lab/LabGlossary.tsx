import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const glossaryItems = [
  {
    title: 'Hash',
    body: '它可以理解为区块数据的指纹。只要区块内容有一点变化，结果就会跟着变化。',
  },
  {
    title: 'Nonce',
    body: '它是矿工不断尝试的数字变量。每次改变这个数字，都会得到新的区块结果。',
  },
  {
    title: 'PoW',
    body: '这是一种要求矿工持续尝试的证明机制，直到找到满足难度条件的结果。',
  },
  {
    title: 'Mempool',
    body: '这是节点存放待确认交易的临时区域，矿工会从这里挑选交易构造候选区块。',
  },
]

export default function LabGlossary() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
        <CardHeader>
          <CardTitle className="text-2xl">术语索引</CardTitle>
          <CardDescription>
            当你在主线里遇到关键术语时，可以随时回到这里查阅基础解释。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {glossaryItems.map((item) => (
          <Card
            key={item.title}
            className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70"
          >
            <CardHeader>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

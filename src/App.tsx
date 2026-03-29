import React from 'react'
import Layout from '@/components/Layout'
import BlockchainVisualization from '@/components/BlockchainVisualization'
import BlockDetails from '@/components/BlockDetails'
import useBlockchainStore from '@/store/useBlockchainStore'
import LabTopNav from '@/components/lab/LabTopNav'
import LabTaskPanel from '@/components/lab/LabTaskPanel'
import LabTimeline from '@/components/lab/LabTimeline'
import LabSandboxControls from '@/components/lab/LabSandboxControls'
import LabAdvancedExperiments from '@/components/lab/LabAdvancedExperiments'
import LabGlossary from '@/components/lab/LabGlossary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const App: React.FC = () => {
  const activeMode = useBlockchainStore((state) => state.activeMode)

  const renderSandboxSidebar = () => (
    <Card className="rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
      <CardHeader>
        <CardTitle className="text-xl">自由实验</CardTitle>
        <CardDescription>
          这里不再按任务推进，而是让你围绕同一套主舞台自由重复创建钱包、发交易、挖矿并观察变化。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
        <p>保留主舞台、对象详情和生命周期时间线，只把左侧切换成实验说明。</p>
        <p>完整动作控件下沉到主工作区下方，避免重新回到旧页面那种纵向控制台堆叠。</p>
      </CardContent>
    </Card>
  )

  const renderLearningWorkspace = () => (
    <div className="space-y-6">
      <div className="grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1.55fr)_300px] 2xl:grid-cols-[300px_minmax(0,1.75fr)_320px]">
        {activeMode === 'guided' ? <LabTaskPanel /> : renderSandboxSidebar()}
        <BlockchainVisualization />
        <BlockDetails />
      </div>

      {activeMode === 'sandbox' && <LabSandboxControls />}

      <LabTimeline />
    </div>
  )

  return (
    <Layout>
      <div className="space-y-6">
        <LabTopNav />
        {(activeMode === 'guided' || activeMode === 'sandbox') && renderLearningWorkspace()}
        {activeMode === 'advanced' && <LabAdvancedExperiments />}
        {activeMode === 'glossary' && <LabGlossary />}
      </div>
    </Layout>
  )
}

export default App

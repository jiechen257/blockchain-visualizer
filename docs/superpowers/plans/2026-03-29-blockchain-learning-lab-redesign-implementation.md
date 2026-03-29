# Blockchain Learning Lab Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前“功能卡片控制台”整体重构为“主线引导 / 自由实验 / 进阶实验 / 术语帮助”四段式区块链协同学习器。

**Architecture:** 保留现有 React + Zustand 的链上领域状态与大部分业务动作，把 UI 结构重构为统一实验室外壳。新增一个 `labFlowSlice` 承载学习模式、主线步骤、解释层级、选中对象与时间线状态；中间主舞台改为单一协同场景，左右栏分别负责任务引导和因果解释，分叉与网络模拟整体下沉到进阶实验页。

**Tech Stack:** React 18, TypeScript, Vite, Zustand, Tailwind CSS, shadcn/ui, Vitest, Testing Library

---

## File Structure Map

### Existing files to modify

- `src/App.tsx`
  - 改为实验室顶层壳与四段式导航入口。
- `src/components/Layout.tsx`
  - 升级为实验室风格头部与容器骨架。
- `src/components/Wallet.tsx`
  - 收缩为自由实验里的钱包动作卡，服务主舞台而不是独立大面板。
- `src/components/Transaction.tsx`
  - 收缩为自由实验里的交易动作卡，并和主线状态同步。
- `src/components/BlockMining.tsx`
  - 收缩为自由实验里的挖矿动作卡，并暴露主线需要的反馈信息。
- `src/components/BlockchainVisualization.tsx`
  - 从 D3 链图改为主舞台协同视图。
- `src/components/BlockDetails.tsx`
  - 重构为对象详情检视器兼容层。
- `src/components/BlockchainForkVisualization.tsx`
  - 改成进阶实验内容。
- `src/components/NetworkSimulation.tsx`
  - 改成进阶实验内容。
- `src/components/Tutorial.tsx`
  - 停用首次弹窗表达，迁移职责。
- `src/store/types.ts`
  - 扩展学习模式、主线步骤、时间线对象等类型。
- `src/store/useBlockchainStore.ts`
  - 注册 `labFlowSlice`。
- `src/store/experienceSlice.ts`
  - 与新的实验室模式联动选中对象与事件。
- `src/store/dashboardSelectors.ts`
  - 改造或迁移为实验室视图 selector。
- `src/components/__tests__/App.dashboard.test.tsx`
  - 改写为实验室主路径测试。
- `src/components/__tests__/Transaction.test.tsx`
  - 校验自由实验和主线联动。
- `src/components/__tests__/BlockMining.test.tsx`
  - 校验挖矿反馈与时间线联动。

### New files to create

- `src/store/labFlowSlice.ts`
  - 存储 `activeMode`、`guideStep`、`timelineStep`、`explanationLevel`、`selectedEntity` 等实验室状态。
- `src/store/labSelectors.ts`
  - 提供主线任务、舞台摘要、时间线、详情面板所需派生数据。
- `src/store/__tests__/labFlowSlice.test.ts`
  - 覆盖模式切换、步骤推进、单步回退与解释层级。
- `src/store/__tests__/labSelectors.test.ts`
  - 覆盖主线任务和时间线派生逻辑。
- `src/components/lab/LabTopNav.tsx`
  - 顶部四段式导航。
- `src/components/lab/LabTaskPanel.tsx`
  - 左侧任务与章节面板。
- `src/components/lab/LabStage.tsx`
  - 中间系统协同主舞台。
- `src/components/lab/LabEntityInspector.tsx`
  - 右侧对象详情检视器。
- `src/components/lab/LabTimeline.tsx`
  - 底部交易生命周期时间线。
- `src/components/lab/LabPlaybackControls.tsx`
  - 播放、暂停、单步、回看、解释层级切换。
- `src/components/lab/LabSandboxControls.tsx`
  - 自由实验模式下的钱包 / 交易 / 挖矿控件组合。
- `src/components/lab/LabAdvancedExperiments.tsx`
  - 进阶实验页，收纳分叉实验与网络模拟。
- `src/components/lab/LabGlossary.tsx`
  - 术语与帮助页。

## Task 1: 建立实验室级失败测试

**Files:**
- Modify: `src/components/__tests__/App.dashboard.test.tsx`
- Create: `src/store/__tests__/labFlowSlice.test.ts`
- Create: `src/store/__tests__/labSelectors.test.ts`

- [ ] **Step 1: 先把首页主路径测试改成“实验室骨架”**

```tsx
it('renders lab navigation, task panel, stage, inspector, and timeline', () => {
  renderWithStore(<App />)
  expect(screen.getByRole('tab', { name: /主线引导/i })).toBeInTheDocument()
  expect(screen.getByText(/当前任务/i)).toBeInTheDocument()
  expect(screen.getByText(/系统协同主舞台/i)).toBeInTheDocument()
  expect(screen.getByText(/对象详情/i)).toBeInTheDocument()
  expect(screen.getByText(/交易生命周期/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: 为模式切换和主线步骤写 store 失败测试**

```ts
it('switches between guided, sandbox, advanced, and glossary modes', () => {
  const store = useBlockchainStore.getState()
  store.setActiveMode('advanced')
  expect(useBlockchainStore.getState().activeMode).toBe('advanced')
})

it('advances and rewinds guide step one phase at a time', () => {
  const store = useBlockchainStore.getState()
  store.advanceGuideStep()
  store.rewindGuideStep()
  expect(useBlockchainStore.getState().guideStep).toBe('wallet')
})
```

- [ ] **Step 3: 跑新增测试确认当前失败**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx src/store/__tests__/labFlowSlice.test.ts src/store/__tests__/labSelectors.test.ts`

Expected: FAIL，原因是实验室组件和 `labFlowSlice` 尚不存在。

## Task 2: 搭建实验室状态底座

**Files:**
- Create: `src/store/labFlowSlice.ts`
- Create: `src/store/labSelectors.ts`
- Modify: `src/store/types.ts`
- Modify: `src/store/useBlockchainStore.ts`
- Create: `src/store/__tests__/labFlowSlice.test.ts`
- Create: `src/store/__tests__/labSelectors.test.ts`

- [ ] **Step 1: 定义实验室状态类型**

最小类型要求：

```ts
export type LabMode = 'guided' | 'sandbox' | 'advanced' | 'glossary'
export type GuideStep = 'wallet' | 'transaction' | 'broadcast' | 'mempool' | 'mining' | 'confirmed'
export type ExplanationLevel = 'basic' | 'deep'
export type TimelineStep = 'draft' | 'broadcast' | 'mempool' | 'mining' | 'confirmed'
```

- [ ] **Step 2: 实现 `labFlowSlice` 的最小动作**

需要提供：

```ts
activeMode: 'guided'
guideStep: 'wallet'
timelineStep: 'draft'
explanationLevel: 'basic'
selectedEntity: null
setActiveMode()
advanceGuideStep()
rewindGuideStep()
setTimelineStep()
setExplanationLevel()
setSelectedEntity()
syncGuideFromState()
```

- [ ] **Step 3: 实现 selector，统一派生左栏和底部时间线**

最少包含：

```ts
selectGuidePanel(state)
selectTimelineItems(state)
selectInspectorState(state)
```

- [ ] **Step 4: 跑 store 测试**

Run: `pnpm test -- src/store/__tests__/labFlowSlice.test.ts src/store/__tests__/labSelectors.test.ts`

Expected: PASS

## Task 3: 重写顶层 App 为实验室壳

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Layout.tsx`
- Create: `src/components/lab/LabTopNav.tsx`
- Create: `src/components/lab/LabTaskPanel.tsx`
- Create: `src/components/lab/LabTimeline.tsx`
- Modify: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 写失败测试，锁定四段式导航和三栏骨架**

```tsx
it('switches to advanced experiments without showing guided panel copy', async () => {
  renderWithStore(<App />)
  await userEvent.click(screen.getByRole('tab', { name: /进阶实验/i }))
  expect(screen.getByText(/分叉实验/i)).toBeInTheDocument()
  expect(screen.queryByText(/当前任务/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: 重写 `App.tsx` 结构**

目标结构：

```tsx
<Layout>
  <LabTopNav />
  {activeMode === 'guided' || activeMode === 'sandbox' ? (
    <main>{/* 左任务 / 中舞台 / 右详情 / 下时间线 */}</main>
  ) : null}
  {activeMode === 'advanced' ? <LabAdvancedExperiments /> : null}
  {activeMode === 'glossary' ? <LabGlossary /> : null}
</Layout>
```

- [ ] **Step 3: 跑 App 测试**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`

Expected: PASS

## Task 4: 把 Tutorial 迁移为左侧任务面板

**Files:**
- Create: `src/components/lab/LabTaskPanel.tsx`
- Create: `src/components/lab/LabPlaybackControls.tsx`
- Modify: `src/components/Tutorial.tsx`
- Modify: `src/store/labFlowSlice.ts`
- Modify: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 写失败测试，锁定左栏持续引导**

```tsx
it('shows current task, next action, and explanation level controls in guided mode', () => {
  renderWithStore(<App />)
  expect(screen.getByText(/当前任务/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /单步前进/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /深入解释/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: 把 `Tutorial.tsx` 改为 no-op 兼容层或移除调用**

要求：App 不再出现首次弹窗。

- [ ] **Step 3: 在任务面板里展示章节、下一步、解释说明与播放控件**

- [ ] **Step 4: 跑测试**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`

Expected: PASS

## Task 5: 重构系统协同主舞台

**Files:**
- Create: `src/components/lab/LabStage.tsx`
- Modify: `src/components/BlockchainVisualization.tsx`
- Modify: `src/store/labSelectors.ts`
- Modify: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 写失败测试，锁定钱包 / 节点 / 矿工 / 主链四个角色**

```tsx
it('renders wallet, node, miner, and blockchain actors in the central stage', () => {
  renderWithStore(<App />)
  expect(screen.getByText(/钱包 \/ 用户/i)).toBeInTheDocument()
  expect(screen.getByText(/节点 \/ 交易池/i)).toBeInTheDocument()
  expect(screen.getByText(/矿工/i)).toBeInTheDocument()
  expect(screen.getByText(/主链/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: 用统一舞台替代旧的横向链图**

实现要求：
  - 默认突出当前主线相关对象
  - 当时间线推进时，交易卡在不同角色区域显示不同状态
  - 点击对象会写入 `selectedEntity`

- [ ] **Step 3: 跑测试**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`

Expected: PASS

## Task 6: 重构对象详情检视器与时间线

**Files:**
- Create: `src/components/lab/LabEntityInspector.tsx`
- Create: `src/components/lab/LabTimeline.tsx`
- Modify: `src/components/BlockDetails.tsx`
- Modify: `src/store/labSelectors.ts`
- Modify: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 写失败测试，锁定对象详情和阶段展示**

```tsx
it('shows transaction lifecycle states in the bottom timeline', () => {
  renderWithStore(<App />)
  expect(screen.getByText(/待签名/i)).toBeInTheDocument()
  expect(screen.getByText(/已广播/i)).toBeInTheDocument()
  expect(screen.getByText(/已进入交易池/i)).toBeInTheDocument()
  expect(screen.getByText(/正在挖矿/i)).toBeInTheDocument()
  expect(screen.getByText(/已确认/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: 重构 `BlockDetails.tsx` 为详情检视器兼容入口**

要求：
  - 默认显示当前主线对象的状态解释
  - 点击交易、矿工、区块、钱包后，右侧更新因果信息

- [ ] **Step 3: 跑测试**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`

Expected: PASS

## Task 7: 把交易、挖矿、钱包动作下沉为主线 / 自由实验控件

**Files:**
- Create: `src/components/lab/LabSandboxControls.tsx`
- Modify: `src/components/Wallet.tsx`
- Modify: `src/components/Transaction.tsx`
- Modify: `src/components/BlockMining.tsx`
- Modify: `src/store/labFlowSlice.ts`
- Modify: `src/components/__tests__/Transaction.test.tsx`
- Modify: `src/components/__tests__/BlockMining.test.tsx`

- [ ] **Step 1: 写失败测试，锁定主线与自由实验联动**

```tsx
it('moves guided timeline to mempool after a valid transaction is created', async () => {
  // 创建两个钱包、提交交易后，timelineStep 应更新为 mempool
})

it('moves guided timeline to confirmed after mining succeeds', async () => {
  // 挖矿成功后，timelineStep 应更新为 confirmed
})
```

- [ ] **Step 2: 改造钱包、交易、挖矿组件**

要求：
  - guided 模式下聚焦主线关键动作
  - sandbox 模式下允许完整自由实验
  - 动作执行后调用 `syncGuideFromState`

- [ ] **Step 3: 跑行为测试**

Run: `pnpm test -- src/components/__tests__/Transaction.test.tsx src/components/__tests__/BlockMining.test.tsx`

Expected: PASS

## Task 8: 下沉进阶实验并新增术语帮助页

**Files:**
- Create: `src/components/lab/LabAdvancedExperiments.tsx`
- Create: `src/components/lab/LabGlossary.tsx`
- Modify: `src/components/BlockchainForkVisualization.tsx`
- Modify: `src/components/NetworkSimulation.tsx`
- Modify: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 写失败测试，锁定 advanced / glossary 页面**

```tsx
it('shows fork experiment in advanced mode', async () => {
  renderWithStore(<App />)
  await userEvent.click(screen.getByRole('tab', { name: /进阶实验/i }))
  expect(screen.getByText(/分叉实验/i)).toBeInTheDocument()
})

it('shows glossary terms in glossary mode', async () => {
  renderWithStore(<App />)
  await userEvent.click(screen.getByRole('tab', { name: /术语索引/i }))
  expect(screen.getByText(/Hash/i)).toBeInTheDocument()
  expect(screen.getByText(/Nonce/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: 把分叉和网络模拟移出主页面默认视图**

- [ ] **Step 3: 新增静态术语解释页**

- [ ] **Step 4: 跑测试**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`

Expected: PASS

## Task 9: 视觉统一、回归验证与清理旧表达

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css`
- Modify: `src/components/Layout.tsx`
- Modify: `src/components/lab/*.tsx`
- Modify: `src/components/Tutorial.tsx`
- Test: `src/components/__tests__/App.dashboard.test.tsx`
- Test: `src/components/__tests__/Transaction.test.tsx`
- Test: `src/components/__tests__/BlockMining.test.tsx`
- Test: `src/store/__tests__/labFlowSlice.test.ts`
- Test: `src/store/__tests__/labSelectors.test.ts`

- [ ] **Step 1: 清理旧 dashboard 文案和不再使用的首次弹窗表达**

- [ ] **Step 2: 统一实验室视觉方向**

要求：
  - 左右栏降权，中间舞台升权
  - 保持亮色、克制、步骤感强
  - 移动端改为任务面板 -> 主舞台 -> 详情 -> 时间线的顺序

- [ ] **Step 3: 跑完整验证**

Run: `pnpm test`
Expected: PASS

Run: `pnpm lint`
Expected: PASS

Run: `pnpm build`
Expected: PASS

- [ ] **Step 4: 进行手动验证**

手动检查：
  - 默认进入主线引导，而不是旧功能拼盘
  - 可以切到自由实验并完成钱包、交易、挖矿
  - 进阶实验页默认不干扰主线
  - 术语帮助页可读取 Hash / Nonce / PoW 基础解释
  - 左中右与底部时间线在桌面端、移动端都可读

## Verification Checklist

- `pnpm test`
- `pnpm lint`
- `pnpm build`
- 手动验证主线引导 / 自由实验 / 进阶实验 / 术语帮助四条主路径

# Blockchain Visualizer UI/UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Historical checkboxes below are preserved as the authored plan record.

**Goal:** 在不重写核心区块链逻辑的前提下，把当前项目升级为“现代产品化”的混合式控制台首页，补齐状态总览、操作反馈、轻量事件流、结构化区块详情与持续引导。

**Architecture:** 保留现有 React + Zustand + D3 的主体结构，新增一个轻量体验状态 slice 承载事件流、选中区块与网络模拟状态，并用一个首页控制台容器串起 Hero、状态卡、操作工作台与可视化舞台。实现采用“先补测试与状态底座，再逐层替换 UI”的方式，避免在一个大提交里同时改业务逻辑、样式和可视化。

**Tech Stack:** React 18, TypeScript, Vite, Zustand, shadcn/ui, Tailwind CSS, D3, Vitest, Testing Library

## Execution Status

- 状态：已实现并完成验证（2026-03-29）
- 自动验证：
  - `pnpm test`
  - `pnpm lint`
  - `pnpm build`
- 运行验证：
  - 本地启动 `pnpm dev --host 127.0.0.1 --port 4173`
  - 使用 Playwright 驱动浏览器完成“创建钱包 -> 发起交易 -> 挖矿 -> 查看结构化区块详情 -> 启停网络模拟”主路径校验
  - 桌面端与移动端页面截图已生成于 `/tmp/blockchain-plan-verify.png` 与 `/tmp/blockchain-plan-verify-mobile.png`

---

## File Structure Map

### Existing files to modify

- `package.json`
  - 增加 `test` / `test:watch` 脚本，以及测试依赖声明。
- `vite.config.ts`
  - 增加 Vitest 配置、`jsdom` 测试环境和测试 setup 文件。
- `src/App.tsx`
  - 从“平铺组件”改成首页控制台编排容器。
- `src/components/Layout.tsx`
  - 升级页面外框、Hero 容器和整体背景层次。
- `src/components/Wallet.tsx`
  - 改造成更紧凑的钱包资产卡片区，支持快捷动作。
- `src/components/WalletSelect.tsx`
  - 统一地址缩略展示和空状态行为。
- `src/components/Transaction.tsx`
  - 增加表单校验、结果反馈与下一步引导。
- `src/components/BlockMining.tsx`
  - 增加待打包概览、空块提示、结果摘要与处理中状态。
- `src/components/BlockDetails.tsx`
  - 收缩为兼容层，最终由结构化详情组件接管。
- `src/components/NetworkSimulation.tsx`
  - 改为读取共享模拟状态，并在启停时写入事件流。
- `src/components/BlockchainVisualization.tsx`
  - 升级主链舞台样式与选中区块联动。
- `src/components/BlockchainForkVisualization.tsx`
  - 统一风格、强化主链/分叉状态标签。
- `src/components/Tutorial.tsx`
  - 缩短首次引导步骤，和首页 Checklist 形成配合。
- `src/index.css`
  - 重建全局颜色变量、页面背景、卡片层级和响应式细节。
- `src/App.css`
  - 清理 Vite 默认样式残留，必要时删除引用内容。
- `src/store/types.ts`
  - 增加事件流与体验状态相关类型。
- `src/store/useBlockchainStore.ts`
  - 注册新的体验状态 slice。
- `src/store/walletSlice.ts`
  - 钱包创建后写入事件流，提供快捷选择辅助状态。
- `src/store/transactionSlice.ts`
  - 交易进入池时写入事件流。
- `src/store/blockchainSlice.ts`
  - 挖矿/分叉行为联动事件流和选中主链数据。

### New files to create

- `src/store/experienceSlice.ts`
  - 存储 `activityFeed`、`selectedBlockHash`、`isSimulating`、`simulationSpeed`、`focusedAction` 等体验状态。
- `src/store/dashboardSelectors.ts`
  - 提供总览卡与 Checklist 所需的派生数据，避免组件内部拼装。
- `src/test/setup.ts`
  - 注册 `@testing-library/jest-dom`。
- `src/test/renderWithStore.tsx`
  - 为组件测试提供统一 render helper 和 store reset 工具。
- `src/store/__tests__/experienceSlice.test.ts`
  - 覆盖事件流保留上限、选中区块、模拟状态等。
- `src/store/__tests__/dashboardSelectors.test.ts`
  - 覆盖状态卡和 Checklist 的派生逻辑。
- `src/components/dashboard/DashboardHero.tsx`
  - 渲染标题、副标题和主 CTA。
- `src/components/dashboard/SystemStatCards.tsx`
  - 渲染 4-5 个系统状态卡。
- `src/components/dashboard/QuickActions.tsx`
  - 承载“创建钱包 / 发起交易 / 开始挖矿”快捷入口。
- `src/components/dashboard/RecentActivityFeed.tsx`
  - 渲染最近 20 条活动事件。
- `src/components/dashboard/QuickStartChecklist.tsx`
  - 渲染持续引导清单。
- `src/components/dashboard/StructuredBlockDetails.tsx`
  - 展示结构化区块详情。
- `src/components/__tests__/App.dashboard.test.tsx`
  - 覆盖首页控制台主路径。
- `src/components/__tests__/Transaction.test.tsx`
  - 覆盖交易表单校验与成功反馈。
- `src/components/__tests__/BlockMining.test.tsx`
  - 覆盖空块提示和挖矿成功反馈。

## Task 1: 建立测试底座与计划校验脚本

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/renderWithStore.tsx`
- Test: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 写一个会失败的首页 smoke test**

```tsx
import { render, screen } from '@testing-library/react';
import App from '@/App';

it('renders a system overview heading', () => {
  render(<App />);
  expect(screen.getByText(/系统总览/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认当前失败**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: FAIL，原因是测试命令尚不存在，或首页中不存在“系统总览”。

- [ ] **Step 3: 安装测试依赖并补齐脚本**

Run: `pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`

在 `package.json` 中加入：

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

在 `vite.config.ts` 中加入：

```ts
test: {
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
  globals: true,
}
```

- [ ] **Step 4: 创建测试 setup 和 store render helper**

`src/test/setup.ts`

```ts
import '@testing-library/jest-dom';
```

`src/test/renderWithStore.tsx`

```tsx
import { render } from '@testing-library/react';
import useBlockchainStore from '@/store/useBlockchainStore';

const initialState = useBlockchainStore.getState();

export const resetStore = () => useBlockchainStore.setState(initialState, true);

export const renderWithStore = (ui: React.ReactElement) => {
  resetStore();
  return render(ui);
};
```

- [ ] **Step 5: 运行测试与 lint，确认基线建立**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: FAIL，但失败原因已经切换成真实断言失败，而不是缺少测试工具。

Run: `pnpm lint`
Expected: PASS 或仅暴露与即将改造相关的问题。

- [ ] **Step 6: 提交测试底座**

```bash
git add package.json vite.config.ts src/test/setup.ts src/test/renderWithStore.tsx src/components/__tests__/App.dashboard.test.tsx
git commit -m "test: add vitest setup for dashboard refactor"
```

## Task 2: 增加体验状态 slice 与总览 selectors

**Files:**
- Create: `src/store/experienceSlice.ts`
- Create: `src/store/dashboardSelectors.ts`
- Modify: `src/store/types.ts`
- Modify: `src/store/useBlockchainStore.ts`
- Modify: `src/store/walletSlice.ts`
- Modify: `src/store/transactionSlice.ts`
- Modify: `src/store/blockchainSlice.ts`
- Test: `src/store/__tests__/experienceSlice.test.ts`
- Test: `src/store/__tests__/dashboardSelectors.test.ts`

- [ ] **Step 1: 写失败的 store 测试，锁定事件流与状态卡需求**

```ts
it('keeps only the latest 20 activity events', () => {
  const store = useBlockchainStore.getState();
  for (let index = 0; index < 21; index += 1) {
    store.pushActivity({
      type: 'wallet.created',
      title: `wallet ${index}`,
      timestamp: index,
    });
  }

  expect(useBlockchainStore.getState().activityFeed).toHaveLength(20);
});

it('derives dashboard stats from store state', () => {
  const stats = selectDashboardStats({
    wallets: [{ address: 'a', balance: 100, privateKey: 'p', publicKey: 'g' }],
    pendingTransactions: [{ id: '1', from: 'a', to: 'b', amount: 2, fee: 1, timestamp: 1 }],
    chains: [{ id: 'main', isMain: true, blocks: [{ index: 0, timestamp: 1, transactions: [], previousHash: '0', hash: 'abc', nonce: 0 }] }],
    isSimulating: true,
  } as any);

  expect(stats.pendingCount.value).toBe(1);
  expect(stats.networkStatus.value).toBe('运行中');
});
```

- [ ] **Step 2: 运行 store 测试确认失败**

Run: `pnpm test -- src/store/__tests__/experienceSlice.test.ts src/store/__tests__/dashboardSelectors.test.ts`
Expected: FAIL，原因是 `experienceSlice` / selector 尚不存在。

- [ ] **Step 3: 扩展类型定义与注册新 slice**

在 `src/store/types.ts` 中新增最小类型：

```ts
export interface ActivityEvent {
  id: string;
  type: 'wallet.created' | 'transaction.created' | 'block.mined' | 'fork.created' | 'fork.resolved' | 'simulation.started' | 'simulation.stopped';
  title: string;
  description?: string;
  timestamp: number;
}
```

在 `src/store/experienceSlice.ts` 中提供：

```ts
activityFeed: ActivityEvent[];
selectedBlockHash: string | null;
isSimulating: boolean;
simulationSpeed: number;
pushActivity: (event: Omit<ActivityEvent, 'id'>) => void;
setSelectedBlockHash: (hash: string | null) => void;
setSimulationState: (next: boolean) => void;
setSimulationSpeed: (next: number) => void;
```

- [ ] **Step 4: 在现有业务 slice 中接入事件写入**

最小实现要求：

```ts
pushActivity({
  type: 'wallet.created',
  title: '已创建新钱包',
  description: `${address.slice(0, 8)}... 已可用于发起交易`,
  timestamp: Date.now(),
});
```

对 `transaction.created`、`block.mined`、`fork.created`、`fork.resolved` 同样处理，并保证只保留最近 20 条。

- [ ] **Step 5: 编写总览 selector，集中派生首页数据**

`src/store/dashboardSelectors.ts`

```ts
export const selectDashboardStats = (state: FullState) => ({
  walletCount: { label: '钱包数量', value: state.wallets.length },
  pendingCount: { label: '待确认交易', value: state.pendingTransactions.length },
  chainHeight: { label: '主链高度', value: state.chains.find((chain) => chain.isMain)?.blocks.length ?? 0 },
  latestHash: { label: '最新区块', value: state.chains.find((chain) => chain.isMain)?.blocks.at(-1)?.hash?.slice(0, 10) ?? '--' },
  networkStatus: { label: '网络状态', value: state.isSimulating ? '运行中' : '已停止' },
});
```

- [ ] **Step 6: 跑测试，确保 store 底座通过**

Run: `pnpm test -- src/store/__tests__/experienceSlice.test.ts src/store/__tests__/dashboardSelectors.test.ts`
Expected: PASS

- [ ] **Step 7: 提交 store 底座**

```bash
git add src/store/types.ts src/store/useBlockchainStore.ts src/store/walletSlice.ts src/store/transactionSlice.ts src/store/blockchainSlice.ts src/store/experienceSlice.ts src/store/dashboardSelectors.ts src/store/__tests__/experienceSlice.test.ts src/store/__tests__/dashboardSelectors.test.ts
git commit -m "feat: add dashboard experience state"
```

## Task 3: 重组首页为控制台布局

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Layout.tsx`
- Create: `src/components/dashboard/DashboardHero.tsx`
- Create: `src/components/dashboard/SystemStatCards.tsx`
- Create: `src/components/dashboard/QuickActions.tsx`
- Test: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 扩展首页测试，描述目标布局**

```tsx
it('renders hero, stat cards, and visualization stage sections', () => {
  render(<App />);
  expect(screen.getByText(/系统总览/i)).toBeInTheDocument();
  expect(screen.getByText(/快速开始/i)).toBeInTheDocument();
  expect(screen.getByText(/主链舞台/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: FAIL，因为当前 `App.tsx` 仍是旧的平铺布局。

- [ ] **Step 3: 新建首页总览组件**

`src/components/dashboard/DashboardHero.tsx`

```tsx
export default function DashboardHero() {
  return (
    <section>
      <p>交互式模拟与可视化系统</p>
      <h2>系统总览</h2>
      <p>从钱包、交易到挖矿与分叉，一屏观察链上变化。</p>
    </section>
  );
}
```

`src/components/dashboard/SystemStatCards.tsx`

```tsx
const stats = useBlockchainStore(selectDashboardStats);
```

`src/components/dashboard/QuickActions.tsx`

```tsx
<Button onClick={createWallet}>创建钱包</Button>
<Button onClick={() => setFocusedAction('transaction')}>发起交易</Button>
<Button onClick={() => setFocusedAction('mining')}>开始挖矿</Button>
```

- [ ] **Step 4: 重写 `App.tsx` 的版式编排**

目标结构：

```tsx
<Layout>
  <DashboardHero />
  <SystemStatCards />
  <section>{/* Wallet + Transaction + Mining + Checklist + Activity */}</section>
  <section>{/* BlockchainVisualization + Fork + StructuredBlockDetails */}</section>
</Layout>
```

- [ ] **Step 5: 升级 `Layout.tsx` 背景和容器层级**

最小方向：

```tsx
<div className="min-h-screen bg-slate-50 text-slate-950">
  <header className="border-b bg-white/80 backdrop-blur">...</header>
  <main className="mx-auto max-w-7xl px-4 py-8">...</main>
</div>
```

- [ ] **Step 6: 运行首页测试，确认控制台骨架成立**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: PASS

- [ ] **Step 7: 提交首页骨架**

```bash
git add src/App.tsx src/components/Layout.tsx src/components/dashboard/DashboardHero.tsx src/components/dashboard/SystemStatCards.tsx src/components/dashboard/QuickActions.tsx src/components/__tests__/App.dashboard.test.tsx
git commit -m "feat: add dashboard shell and overview cards"
```

## Task 4: 重做钱包面板与快捷入口

**Files:**
- Modify: `src/components/Wallet.tsx`
- Modify: `src/components/WalletSelect.tsx`
- Modify: `src/components/dashboard/QuickActions.tsx`
- Test: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 补一个钱包空状态测试**

```tsx
it('shows a create-wallet empty state when no wallets exist', () => {
  render(<App />);
  expect(screen.getByText(/创建第一个钱包/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: FAIL，当前钱包组件没有显著空状态。

- [ ] **Step 3: 把 `Wallet.tsx` 改成资产卡片布局**

最小结构：

```tsx
{wallets.length === 0 ? (
  <EmptyStateCard title="还没有钱包" actionLabel="创建第一个钱包" onAction={createWallet} />
) : (
  wallets.map((wallet) => (
    <article key={wallet.address}>
      <h3>{wallet.address.slice(0, 10)}...</h3>
      <p>{wallet.balance} 币</p>
      <Button onClick={() => setFocusedAction('transaction')}>用于发交易</Button>
      <Button onClick={() => setPreferredMinerAddress(wallet.address)}>设为挖矿奖励地址</Button>
    </article>
  ))
)}
```

- [ ] **Step 4: 缩略 `WalletSelect` 展示并统一空态**

```tsx
<SelectItem value={wallet.address}>
  {wallet.address.slice(0, 8)}... ({wallet.balance} 币)
</SelectItem>
```

- [ ] **Step 5: 运行测试确认钱包主路径通过**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: PASS

- [ ] **Step 6: 提交钱包改造**

```bash
git add src/components/Wallet.tsx src/components/WalletSelect.tsx src/components/dashboard/QuickActions.tsx src/components/__tests__/App.dashboard.test.tsx
git commit -m "feat: redesign wallet panel for quick actions"
```

## Task 5: 重做交易卡的校验与反馈闭环

**Files:**
- Modify: `src/components/Transaction.tsx`
- Modify: `src/store/transactionSlice.ts`
- Test: `src/components/__tests__/Transaction.test.tsx`

- [ ] **Step 1: 写交易表单失败测试**

```tsx
it('shows a validation message when sender and receiver are the same', async () => {
  render(<Transaction />);
  await userEvent.click(screen.getByRole('button', { name: /发送交易/i }));
  expect(screen.getByText(/请选择有效的钱包组合/i)).toBeInTheDocument();
});

it('shows success guidance after adding a transaction to the pool', async () => {
  expect(await screen.findByText(/交易已加入待确认池/i)).toBeInTheDocument();
  expect(screen.getByText(/现在可以去挖矿确认它/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/components/__tests__/Transaction.test.tsx`
Expected: FAIL，因为当前组件没有这些提示。

- [ ] **Step 3: 在 `Transaction.tsx` 中拆出校验与反馈状态**

最小状态：

```tsx
const [error, setError] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
```

最小校验：

```tsx
if (!from || !to || from === to) {
  setError('请选择有效的钱包组合');
  return;
}
```

- [ ] **Step 4: 提交成功后渲染反馈与下一步提示**

```tsx
setSuccessMessage('交易已加入待确认池，现在可以去挖矿确认它');
```

并确保该动作会通过 slice 写入 `transaction.created` 事件。

- [ ] **Step 5: 运行组件测试**

Run: `pnpm test -- src/components/__tests__/Transaction.test.tsx`
Expected: PASS

- [ ] **Step 6: 提交交易反馈改造**

```bash
git add src/components/Transaction.tsx src/store/transactionSlice.ts src/components/__tests__/Transaction.test.tsx
git commit -m "feat: improve transaction form feedback"
```

## Task 6: 重做挖矿卡、模拟状态与事件流联动

**Files:**
- Modify: `src/components/BlockMining.tsx`
- Modify: `src/components/NetworkSimulation.tsx`
- Create: `src/components/dashboard/RecentActivityFeed.tsx`
- Modify: `src/store/experienceSlice.ts`
- Modify: `src/store/blockchainSlice.ts`
- Test: `src/components/__tests__/BlockMining.test.tsx`

- [ ] **Step 1: 写挖矿与模拟状态失败测试**

```tsx
it('shows an empty-block notice when mining without pending transactions', async () => {
  render(<BlockMining />);
  await userEvent.click(screen.getByRole('button', { name: /挖掘新区块/i }));
  expect(await screen.findByText(/本次挖出的是空块/i)).toBeInTheDocument();
});

it('records simulation start and stop events', () => {
  const state = useBlockchainStore.getState();
  state.setSimulationState(true);
  state.setSimulationState(false);
  expect(useBlockchainStore.getState().activityFeed[0].type).toBe('simulation.stopped');
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/components/__tests__/BlockMining.test.tsx src/store/__tests__/experienceSlice.test.ts`
Expected: FAIL

- [ ] **Step 3: 把挖矿卡升级为“状态 + 结果摘要”面板**

最小反馈状态：

```tsx
const [status, setStatus] = useState<'idle' | 'mining' | 'success' | 'error'>('idle');
const [resultSummary, setResultSummary] = useState<string | null>(null);
```

空块提示：

```tsx
if (transactionsToMine.length === 0) {
  setResultSummary('本次挖出的是空块，但主链高度仍然会增加');
}
```

- [ ] **Step 4: 让 `NetworkSimulation.tsx` 读取共享模拟状态**

目标：

```tsx
const { isSimulating, simulationSpeed, setSimulationState, setSimulationSpeed } = useBlockchainStore();
```

并在启停时写入 `simulation.started` / `simulation.stopped` 事件。

- [ ] **Step 5: 新建事件流组件**

`src/components/dashboard/RecentActivityFeed.tsx`

```tsx
return activityFeed.map((event) => (
  <li key={event.id}>
    <p>{event.title}</p>
    <p>{formatDistanceToNow(event.timestamp)}</p>
  </li>
));
```

如果不引入 `date-fns`，就用简单的“刚刚 / N 分钟前”本地 helper，避免额外依赖。

- [ ] **Step 6: 运行测试，确认反馈链路通过**

Run: `pnpm test -- src/components/__tests__/BlockMining.test.tsx src/store/__tests__/experienceSlice.test.ts`
Expected: PASS

- [ ] **Step 7: 提交挖矿与事件流**

```bash
git add src/components/BlockMining.tsx src/components/NetworkSimulation.tsx src/components/dashboard/RecentActivityFeed.tsx src/store/experienceSlice.ts src/store/blockchainSlice.ts src/components/__tests__/BlockMining.test.tsx src/store/__tests__/experienceSlice.test.ts
git commit -m "feat: add mining feedback and activity feed"
```

## Task 7: 加入 Checklist 与轻量 Tutorial

**Files:**
- Create: `src/components/dashboard/QuickStartChecklist.tsx`
- Modify: `src/components/Tutorial.tsx`
- Modify: `src/App.tsx`
- Modify: `src/store/dashboardSelectors.ts`
- Test: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 写首页引导测试**

```tsx
it('shows checklist items after tutorial is dismissed', async () => {
  render(<App />);
  expect(await screen.findByText(/创建一个钱包/i)).toBeInTheDocument();
  expect(screen.getByText(/发起一笔交易/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: FAIL，因为当前 `Tutorial` 和首页没有持续引导协作。

- [ ] **Step 3: 通过 selector 计算 Checklist 完成态**

```ts
export const selectChecklist = (state: FullState) => [
  { key: 'wallet', label: '创建一个钱包', done: state.wallets.length > 0 },
  { key: 'transaction', label: '发起一笔交易', done: state.activityFeed.some((item) => item.type === 'transaction.created') },
  { key: 'mined', label: '挖出一个新区块', done: state.activityFeed.some((item) => item.type === 'block.mined') },
];
```

- [ ] **Step 4: 新建 Checklist 组件，并缩短 Tutorial 步骤**

`src/components/Tutorial.tsx` 的步骤控制为 3-4 个：

```ts
['创建钱包', '发起交易', '挖矿确认', '观察主链变化']
```

Checklist 组件要求始终可见，不依赖弹窗存在。

- [ ] **Step 5: 运行首页测试**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: PASS

- [ ] **Step 6: 提交引导改造**

```bash
git add src/components/dashboard/QuickStartChecklist.tsx src/components/Tutorial.tsx src/App.tsx src/store/dashboardSelectors.ts src/components/__tests__/App.dashboard.test.tsx
git commit -m "feat: add persistent onboarding checklist"
```

## Task 8: 升级主链/分叉舞台与结构化区块详情

**Files:**
- Create: `src/components/dashboard/StructuredBlockDetails.tsx`
- Modify: `src/components/BlockchainVisualization.tsx`
- Modify: `src/components/BlockchainForkVisualization.tsx`
- Modify: `src/components/BlockDetails.tsx`
- Modify: `src/store/experienceSlice.ts`
- Test: `src/components/__tests__/App.dashboard.test.tsx`

- [ ] **Step 1: 写交互失败测试**

```tsx
it('shows structured block details after selecting a block', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /区块 0/i }));
  expect(await screen.findByText(/前序哈希/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: FAIL，因为当前只会展示原始 JSON。

- [ ] **Step 3: 让主链视图支持选中区块**

实现要求：

```ts
on('click', (_event, block) => {
  setSelectedBlockHash(block.hash);
});
```

并对最新区块、选中区块增加不同样式。

- [ ] **Step 4: 新建结构化区块详情组件**

`src/components/dashboard/StructuredBlockDetails.tsx`

```tsx
<dl>
  <div><dt>区块高度</dt><dd>{block.index}</dd></div>
  <div><dt>哈希</dt><dd>{block.hash}</dd></div>
  <div><dt>前序哈希</dt><dd>{block.previousHash}</dd></div>
  <div><dt>交易数量</dt><dd>{block.transactions.length}</dd></div>
  <div><dt>时间戳</dt><dd>{new Date(block.timestamp).toLocaleString()}</dd></div>
  <div><dt>Nonce</dt><dd>{block.nonce}</dd></div>
</dl>
```

并确保 `selectedBlockHash` 变化时，这 6 个字段都会跟随更新，而不是保留上一次选中的旧值。

- [ ] **Step 5: 统一分叉视图颜色与标签**

最小要求：

```ts
.attr('fill', chain.isMain ? '#0f766e' : '#f59e0b')
```

并在界面文本中明确“主链”“分叉链”。

- [ ] **Step 6: 运行测试**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: PASS

- [ ] **Step 7: 提交可视化舞台升级**

```bash
git add src/components/dashboard/StructuredBlockDetails.tsx src/components/BlockchainVisualization.tsx src/components/BlockchainForkVisualization.tsx src/components/BlockDetails.tsx src/store/experienceSlice.ts src/components/__tests__/App.dashboard.test.tsx
git commit -m "feat: upgrade blockchain visualization stage"
```

## Task 9: 统一视觉层与最终验证

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css`
- Modify: `src/components/Layout.tsx`
- Modify: `src/components/dashboard/DashboardHero.tsx`
- Modify: `src/components/dashboard/SystemStatCards.tsx`
- Modify: `src/components/dashboard/QuickActions.tsx`
- Modify: `src/components/dashboard/RecentActivityFeed.tsx`
- Modify: `src/components/dashboard/QuickStartChecklist.tsx`
- Modify: `src/components/dashboard/StructuredBlockDetails.tsx`
- Test: `src/components/__tests__/App.dashboard.test.tsx`
- Test: `src/components/__tests__/Transaction.test.tsx`
- Test: `src/components/__tests__/BlockMining.test.tsx`

- [ ] **Step 1: 写一个视觉层回归测试，确保关键文案仍存在**

```tsx
it('keeps dashboard primary sections visible after styling changes', () => {
  render(<App />);
  expect(screen.getByText(/系统总览/i)).toBeInTheDocument();
  expect(screen.getByText(/最近动态/i)).toBeInTheDocument();
  expect(screen.getByText(/主链舞台/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认基线仍然有效**

Run: `pnpm test -- src/components/__tests__/App.dashboard.test.tsx`
Expected: PASS

- [ ] **Step 3: 重建 `src/index.css` 主题变量并清理 `src/App.css` 默认样式**

最小方向：

```css
:root {
  --background: 200 33% 98%;
  --foreground: 222 47% 11%;
  --primary: 191 91% 36%;
  --card: 0 0% 100%;
}
```

并删除 `logo-spin`、`.read-the-docs` 等 Vite 默认残留。

- [ ] **Step 4: 对状态卡、操作卡、舞台卡补充一致的层级与响应式间距**

目标类名方向：

```tsx
className="rounded-2xl border bg-white/90 shadow-sm ring-1 ring-slate-200/70"
```

- [ ] **Step 5: 跑完整验证**

Run: `pnpm test`
Expected: PASS

Run: `pnpm lint`
Expected: PASS

Run: `pnpm build`
Expected: PASS

- [ ] **Step 6: 进行手动行为验证**

手动检查：

- 创建 0 / 1 / 多个钱包时的首页表现
- 发起交易后的成功提示和事件流更新
- 无待确认交易时挖空块提示是否清晰
- 挖矿后状态卡与主链舞台是否同步
- 开启/停止网络模拟后状态卡与事件流是否同步
- 首次引导关闭后 Checklist 是否持续存在
- 桌面端和移动端布局是否都可读

- [ ] **Step 7: 提交视觉收尾与验证**

```bash
git add src/index.css src/App.css src/components/Layout.tsx src/components/dashboard src/components/__tests__/App.dashboard.test.tsx src/components/__tests__/Transaction.test.tsx src/components/__tests__/BlockMining.test.tsx
git commit -m "feat: polish dashboard visual system"
```

## Verification Checklist

- `pnpm test`
- `pnpm lint`
- `pnpm build`
- 手动验证首页主路径与移动端布局

## Rollback Strategy

- 若首页控制台改造导致主路径不可用，优先回退 `src/App.tsx`、`src/components/dashboard/DashboardHero.tsx`、`src/components/dashboard/SystemStatCards.tsx`、`src/components/dashboard/QuickActions.tsx`、`src/components/dashboard/RecentActivityFeed.tsx`、`src/components/dashboard/QuickStartChecklist.tsx`、`src/components/dashboard/StructuredBlockDetails.tsx`，保留已通过测试的 store 与表单改进。
- 若 D3 舞台升级引入不稳定行为，回退 `BlockchainVisualization.tsx` / `BlockchainForkVisualization.tsx`，保留结构化详情与事件流。
- 若测试基础设施引入配置冲突，先保留 `test` 脚本与 `setup.ts`，撤销仅影响构建的配置部分。

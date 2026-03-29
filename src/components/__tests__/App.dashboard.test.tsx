import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { renderWithStore, resetStore } from '@/test/renderWithStore'
import useBlockchainStore from '@/store/useBlockchainStore'

describe('App learning lab', () => {
  beforeEach(() => {
    resetStore()
    localStorage.clear()
  })

  it('renders lab navigation, task panel, stage, inspector, and timeline', () => {
    renderWithStore(<App />)

    expect(screen.getByRole('tab', { name: /主线引导/i })).toBeInTheDocument()
    expect(screen.getByText(/当前任务/i)).toBeInTheDocument()
    expect(screen.getByText(/系统协同主舞台/i)).toBeInTheDocument()
    expect(screen.getByText(/对象详情/i)).toBeInTheDocument()
    expect(screen.getByText(/交易生命周期/i)).toBeInTheDocument()
  })

  it('shows task guidance and playback controls in guided mode', () => {
    renderWithStore(<App />)

    expect(screen.getByRole('button', { name: /播放演示/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /单步前进/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /回看上一状态/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /深入解释/i })).toBeInTheDocument()
    expect(screen.getByText(/关键术语/i)).toBeInTheDocument()
    expect(screen.queryByText(/钱包管理/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/创建交易/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/区块挖掘/i)).not.toBeInTheDocument()
  })

  it('renders wallet, node, miner, and blockchain actors in the central stage', () => {
    renderWithStore(<App />)

    expect(screen.getByText(/钱包 \/ 用户/i)).toBeInTheDocument()
    expect(screen.getByText(/节点 \/ 交易池/i)).toBeInTheDocument()
    expect(screen.getByText(/^矿工$/i)).toBeInTheDocument()
    expect(screen.getByText(/^主链$/i)).toBeInTheDocument()
  })

  it('shows transaction lifecycle states in the timeline', () => {
    renderWithStore(<App />)

    expect(screen.getByText(/待签名/i)).toBeInTheDocument()
    expect(screen.getByText(/已广播/i)).toBeInTheDocument()
    expect(screen.getByText(/已进入交易池/i)).toBeInTheDocument()
    expect(screen.getByText(/正在挖矿/i)).toBeInTheDocument()
    expect(screen.getByText(/已确认/i)).toBeInTheDocument()
  })

  it('switches to advanced experiments without showing guided task copy', async () => {
    renderWithStore(<App />)

    await userEvent.click(screen.getByRole('tab', { name: /进阶实验/i }))

    expect(screen.getByText(/分叉实验/i)).toBeInTheDocument()
    expect(screen.queryByText(/当前任务/i)).not.toBeInTheDocument()
  })

  it('shows full sandbox controls only in sandbox mode', async () => {
    renderWithStore(<App />)

    await userEvent.click(screen.getByRole('tab', { name: /自由实验/i }))

    expect(screen.getByText(/自由实验控件/i)).toBeInTheDocument()
    expect(screen.getByText(/钱包管理/i)).toBeInTheDocument()
    expect(screen.getByText(/创建交易/i)).toBeInTheDocument()
    expect(screen.getByText(/区块挖掘/i)).toBeInTheDocument()
  })

  it('shows glossary terms in glossary mode', async () => {
    renderWithStore(<App />)

    await userEvent.click(screen.getByRole('tab', { name: /术语索引/i }))

    expect(screen.getByText(/Hash/i)).toBeInTheDocument()
    expect(screen.getByText(/Nonce/i)).toBeInTheDocument()
    expect(screen.getByText(/PoW/i)).toBeInTheDocument()
  })

  it('moves guided task to transaction after creating the first learning wallet', async () => {
    renderWithStore(<App />)

    await userEvent.click(screen.getByRole('button', { name: /创建学习钱包/i }))

    expect(screen.getByText(/选择发送方和接收方，生成一笔待处理交易/i)).toBeInTheDocument()
  })

  it('shows explicit exits to sandbox and advanced experiments after the guide is confirmed', () => {
    useBlockchainStore.setState({
      guideStep: 'confirmed',
      timelineStep: 'confirmed',
    })

    renderWithStore(<App />, { reset: false })

    expect(screen.getByRole('button', { name: /继续自由实验/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /进入进阶实验/i })).toBeInTheDocument()
  })
})

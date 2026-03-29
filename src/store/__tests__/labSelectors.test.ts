import { describe, expect, it } from 'vitest'
import { selectGuidePanel, selectInspectorState, selectTimelineItems } from '@/store/labSelectors'

describe('labSelectors', () => {
  it('derives guided task copy from the current guide step', () => {
    const panelState: Parameters<typeof selectGuidePanel>[0] = {
      activeMode: 'guided',
      guideStep: 'broadcast',
      explanationLevel: 'basic',
      wallets: [],
      pendingTransactions: [],
    }
    const panel = selectGuidePanel(panelState)

    expect(panel.title).toContain('广播')
    expect(panel.nextAction).toContain('单步')
  })

  it('marks timeline items based on the current lifecycle step', () => {
    const timelineState: Parameters<typeof selectTimelineItems>[0] = {
      timelineStep: 'mempool',
    }
    const items = selectTimelineItems(timelineState)

    expect(items.find((item) => item.key === 'draft')?.status).toBe('done')
    expect(items.find((item) => item.key === 'mempool')?.status).toBe('current')
    expect(items.find((item) => item.key === 'confirmed')?.status).toBe('upcoming')
  })

  it('builds a default inspector explanation from the current guide state', () => {
    const inspectorState: Parameters<typeof selectInspectorState>[0] = {
      selectedEntity: null,
      guideStep: 'mining',
      explanationLevel: 'deep',
      wallets: [],
      pendingTransactions: [],
      chains: [{ id: 'main', isMain: true, blocks: [] }],
    }
    const inspector = selectInspectorState(inspectorState)

    expect(inspector.title).toContain('矿工')
    expect(inspector.reason).toContain('Nonce')
  })
})

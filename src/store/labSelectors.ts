import type { FullState } from './useBlockchainStore';
import type {
  ExplanationLevel,
  GuideStep,
  LabSelectedEntity,
  TimelineStep,
} from './types';

type GuidePanelState = Pick<
  FullState,
  'activeMode' | 'guideStep' | 'explanationLevel' | 'wallets' | 'pendingTransactions'
>;

type TimelineState = Pick<FullState, 'timelineStep'>;

type InspectorState = Pick<
  FullState,
  'selectedEntity' | 'guideStep' | 'explanationLevel' | 'wallets' | 'pendingTransactions' | 'chains'
>;

type StageState = Pick<
  FullState,
  'wallets' | 'pendingTransactions' | 'chains' | 'guideStep' | 'timelineStep' | 'selectedEntity'
>;

const guideCopy: Record<
  GuideStep,
  {
    chapter: string;
    title: string;
    summary: string;
    nextAction: string;
    basic: string;
    deep: string;
  }
> = {
  wallet: {
    chapter: '第 1 章：准备角色',
    title: '先准备钱包，让系统里出现交易参与者',
    summary: '钱包代表发起交易和接收资产的角色，是这条学习主线的起点。',
    nextAction: '先创建至少一个钱包；如果要亲自发交易，建议创建两个钱包。',
    basic: '这一阶段先让“谁参与这次交易”变得可见。',
    deep: '钱包是用户与链交互的入口。虽然这里不展开签名细节，但所有后续交易都会从地址身份开始。',
  },
  transaction: {
    chapter: '第 2 章：发起交易',
    title: '选择发送方和接收方，生成一笔待处理交易',
    summary: '现在系统里已经有角色，下一步是让一笔交易真正开始流转。',
    nextAction: '填写发送方、接收方、金额和手续费，提交一笔有效交易。',
    basic: '交易是“谁给谁转了多少钱”的状态声明。',
    deep: '一笔交易一旦生成，就会从用户侧流向网络接收者，再进入交易池等待矿工处理。',
  },
  broadcast: {
    chapter: '第 3 章：广播交易',
    title: '交易广播：交易已经离开发送钱包，正在被节点接收',
    summary: '这一步强调交易不是直接上链，而是先被网络接收与传播。',
    nextAction: '点击“单步前进”，观察交易如何进入节点的交易池。',
    basic: '节点先接收交易，再决定把它放进待打包队列。',
    deep: '广播阶段可以理解为交易进入网络可见范围，但还没有被矿工正式选入候选区块。',
  },
  mempool: {
    chapter: '第 4 章：进入交易池',
    title: '交易已进入 mempool，等待矿工挑选',
    summary: '节点已经接收交易，接下来重点转向矿工与区块构造。',
    nextAction: '可以点击“开始挖矿”，或先单步回看交易从钱包移动到节点的过程。',
    basic: 'mempool 是待打包交易的临时队列。',
    deep: '矿工不会凭空生成新区块，而是优先从交易池挑选尚未确认的交易，把它们组装进候选区块。',
  },
  mining: {
    chapter: '第 5 章：矿工构造区块',
    title: '矿工正在尝试 Nonce，让候选区块满足 PoW 规则',
    summary: '现在重点是 Hash、Nonce 和 PoW 如何共同决定“挖到一个区块”。',
    nextAction: '观察矿工视角，再继续推进到区块确认完成。',
    basic: '矿工会反复尝试不同 Nonce，直到新区块的哈希满足条件。',
    deep: 'Nonce 每变化一次，区块哈希都会变化。PoW 的核心不是“计算一次”，而是“不断尝试直到出现满足难度的结果”。',
  },
  confirmed: {
    chapter: '第 6 章：写入主链',
    title: '新区块已经接入主链，交易状态变为已确认',
    summary: '这说明一笔交易的完整生命周期已经闭环完成。',
    nextAction: '可以切换到“自由实验”重复流程，或进入“进阶实验”观察分叉。',
    basic: '交易被写进区块后，就从待处理状态变成链上已确认。',
    deep: '区块确认不仅改变交易状态，也会改变主链高度、最新区块摘要，以及系统中“当前可信状态”的参照对象。',
  },
};

const guideTerms: Record<
  GuideStep,
  {
    term: string;
    detail: string;
  }[]
> = {
  wallet: [
    { term: '钱包', detail: '用户和链交互的入口，负责持有地址与余额。' },
    { term: '地址', detail: '系统里用来标识参与者的身份标记。' },
    { term: '参与者', detail: '交易一定发生在至少两个角色之间。' },
  ],
  transaction: [
    { term: '交易', detail: '它描述了谁向谁转移多少资产。' },
    { term: '发送方', detail: '发起这笔状态变化的钱包地址。' },
    { term: '手续费', detail: '帮助交易更快被矿工选中的激励。' },
  ],
  broadcast: [
    { term: '广播', detail: '交易先被网络接收，而不是直接进入区块。' },
    { term: '节点', detail: '节点负责接收、验证并传播交易。' },
    { term: '传播', detail: '同一笔交易会被更多网络参与者看见。' },
  ],
  mempool: [
    { term: 'Mempool', detail: '节点暂存待确认交易的临时区域。' },
    { term: '待打包', detail: '说明交易已经被接收，但还没写进区块。' },
    { term: '候选集合', detail: '矿工会从这个集合里挑选交易。' },
  ],
  mining: [
    { term: 'Nonce', detail: '矿工不断尝试的数字变量。' },
    { term: 'Hash', detail: '区块数据的结果指纹，会随 Nonce 改变。' },
    { term: 'PoW', detail: '要求矿工持续尝试直到满足难度条件。' },
  ],
  confirmed: [
    { term: '主链', detail: '当前被系统采纳的可信状态结果。' },
    { term: '区块确认', detail: '交易已经写入区块并接入主链。' },
    { term: '状态闭环', detail: '从钱包出发的一笔交易已完成全流程。' },
  ],
};

const timelineLabels: { key: TimelineStep; label: string }[] = [
  { key: 'draft', label: '待签名' },
  { key: 'broadcast', label: '已广播' },
  { key: 'mempool', label: '已进入交易池' },
  { key: 'mining', label: '正在挖矿' },
  { key: 'confirmed', label: '已确认' },
];

const timelineOrder: TimelineStep[] = timelineLabels.map((item) => item.key);

const getStepExplanation = (step: GuideStep, level: ExplanationLevel) =>
  level === 'deep' ? guideCopy[step].deep : guideCopy[step].basic;

const buildDefaultInspector = (step: GuideStep, level: ExplanationLevel) => {
  const mapping = {
    wallet: {
      title: '钱包视角',
      subtitle: '当前焦点对象：用户钱包',
      status: '等待创建或选择',
      reason: '钱包负责发起交易与接收资产，是系统中的用户角色。',
      nextEffect: '创建钱包后，系统才有可参与交易和奖励分配的地址。',
    },
    transaction: {
      title: '交易视角',
      subtitle: '当前对象：交易草稿',
      status: '尚未广播',
      reason: '交易先在用户侧被创建，随后才会进入网络流转。',
      nextEffect: '提交交易后，它会离开发送钱包，进入节点可见范围。',
    },
    broadcast: {
      title: '节点视角',
      subtitle: '当前对象：网络接收阶段',
      status: '交易已被广播',
      reason: '节点先接收广播消息，再把有效交易放进待打包池。',
      nextEffect: '继续推进后，交易会停留在 mempool，等待矿工选择。',
    },
    mempool: {
      title: '交易池视角',
      subtitle: '当前对象：mempool',
      status: '等待被挑选',
      reason: '交易池保存尚未确认的交易，为矿工打包提供候选集合。',
      nextEffect: '开始挖矿后，矿工会从这里选出交易，构造候选区块。',
    },
    mining: {
      title: '矿工视角',
      subtitle: '当前对象：PoW 尝试过程',
      status: '正在尝试 Nonce',
      reason:
        level === 'deep'
          ? '矿工每次改变 Nonce，都会得到新的区块哈希；只有满足难度约束的结果才能成为有效区块。'
          : '矿工正在不断尝试，直到新区块满足 PoW 条件。',
      nextEffect: '找到满足条件的哈希后，候选区块会接入主链，交易状态也会改成已确认。',
    },
    confirmed: {
      title: '主链视角',
      subtitle: '当前对象：最新确认状态',
      status: '交易已确认',
      reason: '交易已经写入主链的一部分，不再处于待处理队列中。',
      nextEffect: '你可以切换到自由实验再次走完整个流程，或进入进阶实验观察分叉。',
    },
  } as const;

  const selected = mapping[step];
  return {
    ...selected,
    facts: [
      level === 'deep' ? 'Hash 决定区块指纹' : '区块会记录交易结果',
      level === 'deep' ? 'Nonce 是矿工不断尝试的变量' : '矿工负责推动交易上链',
    ],
  };
};

const buildEntityInspector = (state: InspectorState, entity: LabSelectedEntity) => {
  if (entity.type === 'wallet') {
    const wallet = state.wallets.find((item) => item.address === entity.id);
    return {
      title: '对象详情',
      subtitle: '当前焦点对象：用户钱包',
      status: wallet ? `${wallet.balance} 币可用` : '未找到钱包',
      reason: '钱包代表交易的发起方或接收方，是学习主线里的用户角色。',
      nextEffect: '当它作为发送方时，交易会从这里出发；当它作为奖励地址时，会接收挖矿奖励。',
      facts: wallet
        ? [`地址：${wallet.address.slice(0, 12)}...`, `余额：${wallet.balance} 币`]
        : ['请先创建钱包'],
    };
  }

  if (entity.type === 'transaction') {
    const tx = state.pendingTransactions.find((item) => item.id === entity.id);
    return {
      title: '对象详情',
      subtitle: '当前对象：交易',
      status: tx ? '待确认交易' : '交易已被打包或不存在',
      reason: '交易先被广播，再进入交易池，最后由矿工打包进区块。',
      nextEffect: '只要它还在待确认池里，就还没有真正写入主链。',
      facts: tx
        ? [
            `发送方：${tx.from.slice(0, 10)}...`,
            `接收方：${tx.to.slice(0, 10)}...`,
            `金额：${tx.amount} 币`,
            `手续费：${tx.fee} 币`,
          ]
        : ['当前选中的交易已不在待确认池中'],
    };
  }

  if (entity.type === 'node') {
    return {
      title: '对象详情',
      subtitle: '当前对象：节点 / 交易池',
      status: `${state.pendingTransactions.length} 笔交易等待处理`,
      reason: '节点是交易进入系统后的第一站，也是交易池的承载者。',
      nextEffect: '当矿工开始挖矿时，会从这里挑选待确认交易。',
      facts: [
        `待确认交易：${state.pendingTransactions.length} 笔`,
        '当前角色：接收广播、缓存交易、等待矿工取用',
      ],
    };
  }

  if (entity.type === 'miner') {
    return {
      title: '对象详情',
      subtitle: '当前对象：矿工',
      status: state.pendingTransactions.length > 0 ? '可以开始打包交易' : '等待交易进入池',
      reason:
        state.explanationLevel === 'deep'
          ? '矿工会反复修改 Nonce，并重新计算哈希，直到得到满足难度要求的结果。'
          : '矿工负责把交易打包进新区块。',
      nextEffect: '一旦新区块满足条件并接入主链，待确认交易就会变成已确认。',
      facts: ['职责：构造候选区块', '关键概念：Nonce、Hash、PoW'],
    };
  }

  if (entity.type === 'chain') {
    const mainChain = state.chains.find((chain) => chain.isMain);
    const latestBlock = mainChain?.blocks.at(-1);
    return {
      title: '对象详情',
      subtitle: '当前对象：主链',
      status: latestBlock ? `当前高度 ${mainChain?.blocks.length}` : '还没有新区块接入主链',
      reason: '主链是系统当前采纳的状态结果，所有已确认交易都会在这里留下记录。',
      nextEffect: '每增加一个新区块，系统总览和对象详情都会基于最新主链结果刷新。',
      facts: latestBlock
        ? [
            `最新区块：${latestBlock.hash.slice(0, 14)}...`,
            `链高度：${mainChain?.blocks.length ?? 0}`,
          ]
        : ['主链仍处于初始状态'],
    };
  }

  if (entity.type === 'block') {
    const block = state.chains.flatMap((chain) => chain.blocks).find((item) => item.hash === entity.id);
    return {
      title: '对象详情',
      subtitle: '当前对象：区块',
      status: block ? `区块 ${block.index}` : '未找到区块',
      reason: '区块把一组交易、前序哈希和 Nonce 组织成链上可验证的状态单元。',
      nextEffect: '一旦区块接入主链，里面的交易就从待确认转为已确认。',
      facts: block
        ? [
            `哈希：${block.hash.slice(0, 14)}...`,
            `前序哈希：${block.previousHash.slice(0, 14)}...`,
            `交易数：${block.transactions.length}`,
            `Nonce：${block.nonce}`,
          ]
        : ['当前没有对应区块数据'],
    };
  }

  return buildDefaultInspector(state.guideStep, state.explanationLevel);
};

export const selectGuidePanel = (state: GuidePanelState) => {
  const copy = guideCopy[state.guideStep];
  return {
    chapter: copy.chapter,
    title: copy.title,
    summary: copy.summary,
    nextAction: copy.nextAction,
    explanation: getStepExplanation(state.guideStep, state.explanationLevel),
    modeLabel: state.activeMode === 'sandbox' ? '自由实验' : '主线引导',
    walletCount: state.wallets.length,
    pendingCount: state.pendingTransactions.length,
    terms: guideTerms[state.guideStep],
    isComplete: state.guideStep === 'confirmed',
  };
};

export const selectTimelineItems = (state: TimelineState) => {
  const currentIndex = timelineOrder.indexOf(state.timelineStep);
  return timelineLabels.map((item, index) => ({
    ...item,
    status:
      index < currentIndex
        ? 'done'
        : index === currentIndex
          ? 'current'
          : 'upcoming',
  }));
};

export const selectInspectorState = (state: InspectorState) => {
  if (state.selectedEntity) {
    return buildEntityInspector(state, state.selectedEntity);
  }

  return buildDefaultInspector(state.guideStep, state.explanationLevel);
};

export const selectStageSnapshot = (state: StageState) => {
  const mainChain = state.chains.find((chain) => chain.isMain);
  const latestBlock = mainChain?.blocks.at(-1) ?? null;
  const highlightedActor =
    state.guideStep === 'wallet'
      ? 'wallet'
      : state.guideStep === 'transaction'
        ? 'wallet'
        : state.guideStep === 'broadcast' || state.guideStep === 'mempool'
          ? 'node'
          : state.guideStep === 'mining'
          ? 'miner'
            : 'chain';

  const routeItems = [
    {
      actor: 'wallet',
      title: '钱包 / 用户',
      pathLabel: '钱包',
      detail: state.wallets.length > 0 ? `${state.wallets.length} 个地址已准备` : '等待创建地址',
    },
    {
      actor: 'node',
      title: '节点 / 交易池',
      pathLabel: '节点',
      detail: state.pendingTransactions.length > 0 ? `${state.pendingTransactions.length} 笔交易等待挑选` : '等待接收交易',
    },
    {
      actor: 'miner',
      title: '矿工',
      pathLabel: '挖矿站',
      detail: state.guideStep === 'mining' ? '正在尝试 Nonce 与 Hash' : '等待开始构造候选区块',
    },
    {
      actor: 'chain',
      title: '主链',
      pathLabel: '链头',
      detail: latestBlock ? `最新区块 ${latestBlock.index}` : '尚未接入新的确认区块',
    },
  ] as const;

  const stageNarrative = {
    wallet: {
      headline: '先让参与者出现',
      description: '当前舞台只强调这笔交易会由谁发起、谁接收。创建钱包后，系统才有可观察的角色关系。',
      observations: ['先建立地址，再开始交易', '当前重点是参与者，不是网络', '右侧会解释钱包为什么是起点'],
      tokenLabel: '等待主线起步',
    },
    transaction: {
      headline: '交易仍停留在用户侧',
      description: '这一步还没有真正进入网络。只有当你提交交易后，它才会离开发送钱包，进入节点可见范围。',
      observations: ['发送方和接收方都要明确', '手续费会影响被挑选的优先级', '交易先是状态声明，再进入传播'],
      tokenLabel: '交易草稿待提交',
    },
    broadcast: {
      headline: '交易刚刚被节点接收',
      description: '这里强调的是“广播”而不是“确认”。节点先看到交易，随后才会把它放进待打包队列。',
      observations: ['重点从用户侧切到网络侧', '广播不等于上链', '下一步才会进入 mempool'],
      tokenLabel: '网络接收中',
    },
    mempool: {
      headline: '交易已经进入待打包队列',
      description: '现在它停在交易池里，等待矿工挑选。系统的视角已经从钱包转向节点与矿工协作。',
      observations: ['mempool 是临时区，不是最终结果', '矿工会从这里挑选交易', '可以开始观察打包逻辑'],
      tokenLabel: '交易池排队中',
    },
    mining: {
      headline: '矿工正在构造候选区块',
      description: '这里要观察的是 Nonce、Hash 和 PoW 如何一起决定新区块能否成立，而不是只看按钮点击结果。',
      observations: ['Nonce 每次变化都会带来新的 Hash', 'PoW 的关键是持续尝试', '一旦成功，交易状态就会切到已确认'],
      tokenLabel: '候选区块构造中',
    },
    confirmed: {
      headline: '新区块已经接入主链',
      description: '这条主线已经闭环完成。现在可以重复实验，或者进入进阶实验观察分叉与竞争。',
      observations: ['交易已从待处理变为已确认', '主链状态已经更新', '接下来适合切换学习模式继续探索'],
      tokenLabel: '链上确认完成',
    },
  } as const;

  const activeRouteIndex =
    state.timelineStep === 'draft'
      ? 0
      : state.timelineStep === 'broadcast' || state.timelineStep === 'mempool'
        ? 1
        : state.timelineStep === 'mining'
          ? 2
          : 3;

  return {
    walletCount: state.wallets.length,
    pendingCount: state.pendingTransactions.length,
    latestBlock,
    selectedEntity: state.selectedEntity,
    timelineStep: state.timelineStep,
    highlightedActor,
    hasTransactionInFlight: state.pendingTransactions.length > 0 || Boolean(latestBlock?.transactions.length),
    routeItems,
    activeRouteIndex,
    ...stageNarrative[state.guideStep],
  };
};

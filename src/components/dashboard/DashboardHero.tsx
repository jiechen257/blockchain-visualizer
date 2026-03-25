export default function DashboardHero() {
  return (
    <section className="overflow-hidden rounded-[32px] border border-cyan-100 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92)_0%,_rgba(236,254,255,0.92)_52%,_rgba(255,247,237,0.92)_100%)] p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] ring-1 ring-cyan-100/80">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">交互式模拟与可视化系统</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">系统总览</h2>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
        从钱包、交易到挖矿与分叉，一屏观察链上变化。让每一次操作都能看到状态反馈、事件流和链结构变化。
      </p>
    </section>
  );
}

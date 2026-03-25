import useBlockchainStore from '@/store/useBlockchainStore';
import { selectDashboardStats } from '@/store/dashboardSelectors';

const statCardOrder = ['walletCount', 'pendingCount', 'chainHeight', 'latestHash', 'networkStatus'] as const;

export default function SystemStatCards() {
  const stats = useBlockchainStore(selectDashboardStats);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statCardOrder.map((key) => (
        <article key={key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{stats[key].label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats[key].value}</p>
        </article>
      ))}
    </section>
  );
}

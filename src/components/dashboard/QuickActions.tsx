import { Button } from '@/components/ui/button';
import useBlockchainStore from '@/store/useBlockchainStore';

export default function QuickActions() {
  const createWallet = useBlockchainStore((state) => state.createWallet);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={createWallet}>创建钱包</Button>
        {/* 本轮不越界扩展 store，先保留无副作用快捷入口占位。 */}
        <Button variant="outline" disabled title="待后续任务接入焦点状态">
          发起交易
        </Button>
        <Button variant="outline" disabled title="待后续任务接入焦点状态">
          开始挖矿
        </Button>
      </div>
    </section>
  );
}

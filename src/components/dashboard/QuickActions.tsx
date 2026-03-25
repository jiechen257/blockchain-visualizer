import { Button } from '@/components/ui/button';
import useBlockchainStore from '@/store/useBlockchainStore';

export default function QuickActions() {
  const createWallet = useBlockchainStore((state) => state.createWallet);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">快捷入口</p>
          <Button onClick={createWallet}>创建钱包</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled title="后续会开放更快捷的交易入口">
            发起交易
          </Button>
          <Button variant="outline" disabled title="后续会开放更快捷的挖矿入口">
            开始挖矿
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          交易/挖矿入口当前为占位，后续会开放更快捷的体验。
        </p>
      </div>
    </section>
  );
}

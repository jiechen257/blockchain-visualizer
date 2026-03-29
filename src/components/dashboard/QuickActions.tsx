import { Button } from '@/components/ui/button';
import useBlockchainStore from '@/store/useBlockchainStore';

export default function QuickActions() {
  const { createWallet, setFocusedAction, wallets, preferredMinerAddress, setPreferredMinerAddress } =
    useBlockchainStore((state) => ({
      createWallet: state.createWallet,
      setFocusedAction: state.setFocusedAction,
      wallets: state.wallets,
      preferredMinerAddress: state.preferredMinerAddress,
      setPreferredMinerAddress: state.setPreferredMinerAddress,
    }));

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">快捷入口</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">用最短路径完成一次链上闭环</p>
          </div>
          <Button onClick={createWallet}>创建钱包</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setFocusedAction('transaction')}>
            发起交易
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (!preferredMinerAddress && wallets[0]) {
                setPreferredMinerAddress(wallets[0].address);
              }
              setFocusedAction('mining');
            }}
          >
            开始挖矿
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          创建钱包后即可直接跳转到交易或挖矿工作台，活动结果会同步写入右侧事件流。
        </p>
      </div>
    </section>
  );
}

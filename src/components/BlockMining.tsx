import React, { useEffect, useState } from "react";
import useBlockchainStore from "@/store/useBlockchainStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import WalletSelect from "./WalletSelect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createNewBlock, mineBlock } from "@/utils/blockchain";

const BlockMining: React.FC = () => {
	const {
		chains,
		addBlockToChain,
		pendingTransactions,
		removePendingTransaction,
		wallets,
    preferredMinerAddress,
    setPreferredMinerAddress,
    focusedAction,
    setFocusedAction,
	} = useBlockchainStore();
	const [miningRewardAddress, setMiningRewardAddress] = useState(preferredMinerAddress ?? "");
	const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'mining' | 'success' | 'error'>('idle');
  const [resultSummary, setResultSummary] = useState<string | null>(null);

  useEffect(() => {
    if (preferredMinerAddress) {
      setMiningRewardAddress(preferredMinerAddress);
    }
  }, [preferredMinerAddress]);

	const handleMineBlock = () => {
		setError(null);
    setResultSummary(null);
    setStatus('mining');

		if (!miningRewardAddress) {
			setError("请选择一个钱包来接收挖矿奖励");
      setStatus('error');
			return;
		}

		const mainChain = chains.find((chain) => chain.isMain);
		if (!mainChain) {
			setError("找不到主链");
      setStatus('error');
			return;
		}

		try {
			const transactionsToMine = pendingTransactions.slice(0, 5);
			const previousBlock = mainChain.blocks[mainChain.blocks.length - 1];

			if (!previousBlock) {
				const genesisBlock = createNewBlock({
					index: -1,
					hash: "0",
					timestamp: 0,
					transactions: [],
					previousHash: "0",
					nonce: 0,
				});
				const minedGenesisBlock = mineBlock(genesisBlock, 4); // 假设难度为4
				addBlockToChain(mainChain.id, minedGenesisBlock);
			} else {
				const newBlock = createNewBlock(previousBlock);
				newBlock.transactions = transactionsToMine;
				const minedBlock = mineBlock(newBlock, 4); // 假设难度为4
				addBlockToChain(mainChain.id, minedBlock);
				transactionsToMine.forEach((tx) => removePendingTransaction(tx.id));
			}

			const minerWallet = wallets.find(
				(w) => w.address === miningRewardAddress
			);
			if (minerWallet) {
        // 通过 store 更新奖励地址余额，确保总览卡和钱包面板同步刷新。
        useBlockchainStore.setState((state) => ({
          wallets: state.wallets.map((wallet) =>
            wallet.address === miningRewardAddress
              ? { ...wallet, balance: wallet.balance + 10 }
              : wallet
          ),
        }));
			}

      setPreferredMinerAddress(miningRewardAddress);
      setStatus('success');
      setResultSummary(
        transactionsToMine.length === 0
          ? '本次挖出的是空块，但主链高度仍然会增加'
          : `本次已打包 ${transactionsToMine.length} 笔交易，并发放 10 币挖矿奖励`
      );
      if (focusedAction === 'mining') {
        setFocusedAction(null);
      }
		} catch (err) {
			console.error("挖矿过程中出错:", err);
			setError("挖矿过程中出错，请查看控制台以获取更多信息");
      setStatus('error');
		}
	};

	return (
		<Card
      className={`flex h-full flex-col rounded-[28px] border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70 ${
        focusedAction === 'mining' ? 'ring-2 ring-cyan-300' : ''
      }`}
    >
			<CardHeader>
				<CardTitle className="text-xl">区块挖掘</CardTitle>
        <CardDescription>选择奖励地址后手动挖矿。无待确认交易时也会产生空块，便于观察主链高度增长。</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-grow flex-col space-y-4 overflow-hidden">
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">待打包交易</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{pendingTransactions.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">奖励地址</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {miningRewardAddress ? `${miningRewardAddress.slice(0, 8)}...` : '尚未选择'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">挖矿状态</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {status === 'idle' && '等待开始'}
              {status === 'mining' && '处理中'}
              {status === 'success' && '已完成'}
              {status === 'error' && '发生错误'}
            </p>
          </div>
        </div>
				<WalletSelect
					value={miningRewardAddress}
					onValueChange={(value) => {
            setMiningRewardAddress(value);
            setPreferredMinerAddress(value);
          }}
					placeholder="选择钱包"
					label="挖矿奖励地址"
				/>
				<Button onClick={handleMineBlock}>挖掘新区块</Button>
				{error && <p className="text-red-500">{error}</p>}
        {resultSummary && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {resultSummary}
          </div>
        )}
				<ScrollArea className="flex-grow">
					<div className="pr-4">
						<h4 className="mb-2 font-bold">区块链:</h4>
						<ul className="space-y-2">
							{chains.map((chain) =>
								chain.blocks.map((block) => (
									<li
										key={block.hash}
										className="text-sm"
									>
										<span className="font-medium">区块 {block.index}:</span>{" "}
										<span
											className="truncate inline-block max-w-xs"
											title={block.hash}
										>
											{block.hash}
										</span>
									</li>
								))
							)}
						</ul>
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};

export default BlockMining;

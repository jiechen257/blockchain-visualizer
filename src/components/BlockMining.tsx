// src/components/BlockMining.tsx

import React, { useState } from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import WalletSelect from './WalletSelect';
import { createNewBlock, mineBlock } from '@/utils/blockchain'; // 确保这个路径是正确的

const BlockMining: React.FC = () => {
  const { 
    chains, 
    addBlockToChain, 
    pendingTransactions, 
    removePendingTransaction,
    wallets
  } = useBlockchainStore();
  const [miningRewardAddress, setMiningRewardAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleMineBlock = () => {
    setError(null); // 重置错误状态
    
    if (!miningRewardAddress) {
      setError("请选择一个钱包来接收挖矿奖励");
      return;
    }

    const mainChain = chains.find(chain => chain.isMain);
    if (!mainChain) {
      setError("找不到主链");
      return;
    }

    try {
      const transactionsToMine = pendingTransactions.slice(0, 5); // 假设每个区块最多包含5个交易
      const previousBlock = mainChain.blocks[mainChain.blocks.length - 1];
      
      if (!previousBlock) {
        // 如果还没有区块，创建创世区块
        const genesisBlock = createNewBlock({
          index: -1,
          hash: '0',
          timestamp: 0,
          transactions: [],
          previousHash: '0',
          nonce: 0
        });
        const minedGenesisBlock = mineBlock(genesisBlock, 4); // 假设难度为4
        addBlockToChain(mainChain.id, minedGenesisBlock);
      } else {
        const newBlock = createNewBlock(previousBlock);
        newBlock.transactions = transactionsToMine;
        const minedBlock = mineBlock(newBlock, 4); // 假设难度为4
        addBlockToChain(mainChain.id, minedBlock);
        transactionsToMine.forEach(tx => removePendingTransaction(tx.id));
      }

      // 更新矿工的余额（这部分逻辑可能需要移到 store 中）
      const minerWallet = wallets.find(w => w.address === miningRewardAddress);
      if (minerWallet) {
        minerWallet.balance += 10; // 假设挖矿奖励为10个币
      }

      console.log("成功挖掘新区块");
    } catch (err) {
      console.error("挖矿过程中出错:", err);
      setError("挖矿过程中出错，请查看控制台以获取更多信息");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块挖掘</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <WalletSelect
            value={miningRewardAddress}
            onValueChange={setMiningRewardAddress}
            placeholder="选择钱包"
            label="挖矿奖励地址"
          />
          <Button onClick={handleMineBlock} className="w-full">
            挖掘新区块
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          <div className="mt-4">
            <h4 className="font-bold mb-2">区块链:</h4>
            <ul className="space-y-2">
              {chains.map((chain) => 
                chain.blocks.map((block) => (
                  <li key={block.hash} className="text-sm">
                    <span className="font-medium">区块 {block.index}:</span>{' '}
                    <span className="truncate inline-block max-w-xs" title={block.hash}>
                      {block.hash}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockMining;
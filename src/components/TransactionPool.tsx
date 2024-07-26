import React from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from 'framer-motion';

const TransactionPool: React.FC = () => {
  const { pendingTransactions } = useBlockchainStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>交易池</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <AnimatePresence>
            {pendingTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex justify-between items-center p-2 border-b"
              >
                <span className="text-sm truncate">{tx.from} → {tx.to}</span>
                <span className="text-sm font-medium">{tx.amount} 币</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionPool;
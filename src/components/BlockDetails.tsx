import React from 'react';
import { useBlockchainStore } from '../store/useBlockchainStore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const BlockDetails: React.FC = () => {
  const { blockchain } = useBlockchainStore();
  const [selectedBlock, setSelectedBlock] = React.useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块详情</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(value) => setSelectedBlock(Number(value))} value={selectedBlock?.toString() || ''}>
          <SelectTrigger>
            <SelectValue placeholder="选择一个区块" />
          </SelectTrigger>
          <SelectContent>
            {blockchain.map((block, index) => (
              <SelectItem key={block.hash} value={index.toString()}>
                区块 {block.index}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedBlock !== null && (
          <ScrollArea className="h-[200px] mt-4">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(blockchain[selectedBlock], null, 2)}
            </pre>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockDetails;
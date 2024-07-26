import React from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const BlockDetails: React.FC = () => {
  const { chains } = useBlockchainStore();
  const [selectedBlock, setSelectedBlock] = React.useState<string | null>(null);

  const mainChain = chains.find(chain => chain.isMain);

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块详情</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setSelectedBlock} value={selectedBlock || ''}>
          <SelectTrigger>
            <SelectValue placeholder="选择一个区块" />
          </SelectTrigger>
          <SelectContent>
            {mainChain?.blocks.map((block) => (
              <SelectItem key={block.hash} value={block.hash}>
                区块 {block.index}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedBlock && (
          <ScrollArea className="h-[200px] mt-4">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(mainChain?.blocks.find(block => block.hash === selectedBlock), null, 2)}
            </pre>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockDetails;
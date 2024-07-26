// src/components/BlockchainForkVisualization.tsx

import React, { useEffect, useRef } from 'react';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as d3 from 'd3';

const BlockchainForkVisualization: React.FC = () => {
  const { chains, addChain, resolveChainFork } = useBlockchainStore();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleCreateFork = () => {
    const mainChain = chains.find(chain => chain.isMain);
    if (mainChain) {
      const forkPoint = Math.floor(mainChain.blocks.length / 2);
      const newChain = mainChain.blocks.slice(0, forkPoint);
      addChain(newChain);
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const blockSize = 40;
    const blockSpacing = 60;

    svg.attr("width", width).attr("height", height);

    const g = svg.append("g").attr("transform", `translate(20, 20)`);

    chains.forEach((chain, chainIndex) => {
      const chainG = g.append("g").attr("transform", `translate(0, ${chainIndex * 100})`);

      chain.blocks.forEach((block, blockIndex) => {
        chainG.append("rect")
          .attr("x", blockIndex * blockSpacing)
          .attr("y", 0)
          .attr("width", blockSize)
          .attr("height", blockSize)
          .attr("fill", chain.isMain ? "#4CAF50" : "#FFC107")
          .attr("stroke", "#000")
          .attr("stroke-width", 2);

        chainG.append("text")
          .attr("x", blockIndex * blockSpacing + blockSize / 2)
          .attr("y", blockSize / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .text(block.index);

        if (blockIndex > 0) {
          chainG.append("line")
            .attr("x1", (blockIndex - 1) * blockSpacing + blockSize)
            .attr("y1", blockSize / 2)
            .attr("x2", blockIndex * blockSpacing)
            .attr("y2", blockSize / 2)
            .attr("stroke", "#000")
            .attr("stroke-width", 2);
        }
      });

      chainG.append("text")
        .attr("x", -10)
        .attr("y", blockSize / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "central")
        .text(chain.isMain ? "主链" : `分叉 ${chainIndex}`);
    });

  }, [chains]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块链分叉可视化</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className='mr-4' onClick={handleCreateFork}>创建分叉</Button>
          <Button onClick={resolveChainFork}>解决分叉</Button>
          <svg ref={svgRef}></svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainForkVisualization;
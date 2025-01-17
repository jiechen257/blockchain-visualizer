import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import useBlockchainStore from '@/store/useBlockchainStore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const BlockchainVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { chains } = useBlockchainStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height: 400 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { height } = dimensions;
    const blockWidth = 200;
    const blockHeight = 100;
    const blockSpacing = 40;

    const mainChain = chains.find(chain => chain.isMain);
    if (!mainChain) return;

    const totalWidth = mainChain.blocks.length * (blockWidth + blockSpacing);

    svg.attr('width', totalWidth).attr('height', height);

    const container = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    const blocks = container
      .selectAll('g')
      .data(mainChain.blocks)
      .enter()
      .append('g')
      .attr('transform', (_d, i) => `translate(${i * (blockWidth + blockSpacing)}, ${height / 2 - blockHeight / 2})`);

    blocks
      .append('rect')
      .attr('width', blockWidth)
      .attr('height', blockHeight)
      .attr('fill', 'white')
      .attr('stroke', '#4a5568')
      .attr('stroke-width', 2)
      .attr('rx', 10)
      .attr('ry', 10);

    blocks
      .append('text')
      .attr('x', blockWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => `区块 ${d.index}`)
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#2d3748');

    blocks
      .append('text')
      .attr('x', blockWidth / 2)
      .attr('y', 60)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => `交易: ${d.transactions.length}`)
      .style('font-size', '14px')
      .style('fill', '#4a5568');

    blocks
      .append('text')
      .attr('x', blockWidth / 2)
      .attr('y', 90)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => d.hash.substring(0, 10) + '...')
      .style('font-size', '12px')
      .style('fill', '#718096');

    blocks
      .filter((_d, i) => i > 0)
      .append('line')
      .attr('x1', -blockSpacing)
      .attr('y1', blockHeight / 2)
      .attr('x2', 0)
      .attr('y2', blockHeight / 2)
      .attr('stroke', '#4a5568')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#4a5568');

  }, [chains, dimensions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块链可视化</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg ref={svgRef} className="w-full" style={{ minWidth: '100%', height: '400px' }}></svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainVisualization;
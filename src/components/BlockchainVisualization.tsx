import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useBlockchainStore } from '../store/useBlockchainStore';

const BlockchainVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { blockchain } = useBlockchainStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });

  // 更新SVG尺寸的函数
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

  // 使用D3.js绘制区块链可视化
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const blockWidth = Math.min(150, width / (blockchain.length + 1));
    const blockHeight = 100;

    svg.attr('width', width).attr('height', height);

    const blocks = svg
      .selectAll('g')
      .data(blockchain)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * (blockWidth + 40)}, ${height / 2 - blockHeight / 2})`);

    // 绘制区块
    blocks
      .append('rect')
      .attr('width', blockWidth)
      .attr('height', blockHeight)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black');

    // 添加区块索引
    blocks
      .append('text')
      .attr('x', blockWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => `区块 ${d.index}`)
      .style('font-size', `${Math.min(14, blockWidth / 8)}px`)
      .style('font-weight', 'bold');

    // 添加交易数量
    blocks
      .append('text')
      .attr('x', blockWidth / 2)
      .attr('y', 45)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => `交易: ${d.transactions.length}`)
      .style('font-size', `${Math.min(12, blockWidth / 10)}px`);

    // 添加随机数
    blocks
      .append('text')
      .attr('x', blockWidth / 2)
      .attr('y', 70)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => `随机数: ${d.nonce}`)
      .style('font-size', `${Math.min(12, blockWidth / 10)}px`);

    // 添加哈希值（前6位）
    blocks
      .append('text')
      .attr('x', blockWidth / 2)
      .attr('y', 95)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => d.hash.substring(0, 6) + '...')
      .style('font-size', `${Math.min(10, blockWidth / 12)}px`);

    // 添加区块之间的连接线
    blocks
      .filter((d, i) => i > 0)
      .append('line')
      .attr('x1', -40)
      .attr('y1', blockHeight / 2)
      .attr('x2', 0)
      .attr('y2', blockHeight / 2)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    // 添加箭头标记
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
      .attr('fill', 'black');

  }, [blockchain, dimensions]);

  return <svg ref={svgRef} className="w-full"></svg>;
};

export default BlockchainVisualization;
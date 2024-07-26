import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useBlockchainStore } from '../store/useBlockchainStore';

const BlockchainVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { blockchain } = useBlockchainStore();
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

    const { width, height } = dimensions;
    const blockWidth = Math.min(100, width / (blockchain.length + 1));
    const blockHeight = 50;

    svg.attr('width', width).attr('height', height);

    const blocks = svg
      .selectAll('g')
      .data(blockchain)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * (blockWidth + 20)}, ${height / 2 - blockHeight / 2})`);

    blocks
      .append('rect')
      .attr('width', blockWidth)
      .attr('height', blockHeight)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black');

    blocks
      .append('text')
      .attr('x', blockWidth / 2)
      .attr('y', blockHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => `Block ${d.index}`)
      .style('font-size', `${Math.min(12, blockWidth / 6)}px`);

    blocks
      .filter((d, i) => i > 0)
      .append('line')
      .attr('x1', -20)
      .attr('y1', blockHeight / 2)
      .attr('x2', 0)
      .attr('y2', blockHeight / 2)
      .attr('stroke', 'black')
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
      .attr('fill', 'black');

  }, [blockchain, dimensions]);

  return <svg ref={svgRef} className="w-full"></svg>;
};

export default BlockchainVisualization;
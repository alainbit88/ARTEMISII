import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ArtemisData } from '../services/geminiService';
import { useLanguage } from '../lib/LanguageContext';

interface TrajectoryMapProps {
  data: ArtemisData | null;
}

export default function TrajectoryMap({ data }: TrajectoryMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll('*').remove();

    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales with padding to ensure everything fits
    const xCoords = [...data.trajectory.map(d => d.x), 0, 384400];
    const yCoords = [...data.trajectory.map(d => d.y), 0];

    const xScale = d3.scaleLinear()
      .domain([d3.min(xCoords)! - 50000, d3.max(xCoords)! + 50000])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(yCoords)! - 50000, d3.max(yCoords)! + 50000])
      .range([innerHeight, 0]);

    // Add Glow Filter
    const defs = svg.append('defs');
    const glow = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    glow.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    glow.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over');

    // Arrow Marker for direction
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'rgba(255, 120, 0, 0.8)');

    // Draw Earth Image
    g.append('image')
      .attr('xlink:href', '/earth.svg')
      .attr('x', xScale(0) - 40)
      .attr('y', yScale(0) - 40)
      .attr('width', 80)
      .attr('height', 80)
      .attr('filter', 'url(#glow)');

    // Draw Moon Image
    const moonPos = { x: 384400, y: 0 };
    g.append('image')
      .attr('xlink:href', '/moon.svg')
      .attr('x', xScale(moonPos.x) - 25)
      .attr('y', yScale(moonPos.y) - 25)
      .attr('width', 50)
      .attr('height', 50)
      .attr('filter', 'url(#glow)');

    // Draw Trajectory
    const line = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveBasis);

    // Background path for the trajectory
    const path = g.append('path')
      .datum(data.trajectory)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 120, 0, 0.2)')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Animated "flow" path with arrows
    const flowPath = g.append('path')
      .datum(data.trajectory)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 120, 0, 0.6)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '10, 30')
      .attr('marker-end', 'url(#arrowhead)')
      .attr('d', line);

    // Animate the flow
    function animateFlow() {
      flowPath
        .attr('stroke-dashoffset', 40)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
        .on('end', animateFlow);
    }
    animateFlow();

    // Draw Current Position (Orion)
    const currentPos = g.append('g')
      .attr('transform', `translate(${xScale(data.coordinates.x)},${yScale(data.coordinates.y)})`);

    currentPos.append('image')
      .attr('xlink:href', '/orion.svg')
      .attr('x', -25)
      .attr('y', -25)
      .attr('width', 50)
      .attr('height', 50)
      .attr('filter', 'url(#glow)');

    currentPos.append('text')
      .attr('dy', -30)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .text('ORION');

  }, [data, t]);

  return (
    <div className="w-full h-full min-h-[400px] bg-black/20 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden relative">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{t.liveTrajectoryMap}</span>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}

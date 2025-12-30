
import React, { useEffect, useRef, useState } from 'react';
import { select, drag } from 'd3';
import { Point, CircleState, LessonType } from './types';

interface CircleSandboxProps {
  activeLesson?: LessonType;
}

const CircleSandbox: React.FC<CircleSandboxProps> = ({ activeLesson }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [circle, setCircle] = useState<CircleState>({
    center: { x: 200, y: 200 },
    radius: 100
  });

  // Map LessonType to internal view modes
  const [viewMode, setViewMode] = useState<'basics' | 'tangent' | 'sector'>('basics');

  useEffect(() => {
    if (activeLesson === LessonType.TANGENT) setViewMode('tangent');
    else if (activeLesson === LessonType.SECTOR) setViewMode('sector');
    else setViewMode('basics');
  }, [activeLesson]);

  const [stats, setStats] = useState({
    circumference: 0,
    area: 0,
    diameter: 0
  });

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    const { center, radius } = circle;
    const width = 400;
    const height = 400;

    // 1. Draw Grid Lines
    for(let i=0; i<=width; i+=40) {
      svg.append('line').attr('x1', i).attr('y1', 0).attr('x2', i).attr('y2', height).attr('stroke', 'rgba(255,255,255,0.03)');
      svg.append('line').attr('x1', 0).attr('y1', i).attr('x2', width).attr('y2', i).attr('stroke', 'rgba(255,255,255,0.03)');
    }

    // 2. Draw Main Circle
    svg.append('circle')
      .attr('cx', center.x).attr('cy', center.y).attr('r', radius)
      .attr('fill', 'rgba(139, 92, 246, 0.08)')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 3)
      .attr('class', 'drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]');

    // 3. Mode Specific Visuals
    if (viewMode === 'tangent') {
      const angle = Math.PI / 4;
      const tx = center.x + radius * Math.cos(angle);
      const ty = center.y + radius * Math.sin(angle);
      const lineLen = 150;
      const x1 = tx - lineLen * Math.sin(angle);
      const y1 = ty + lineLen * Math.cos(angle);
      const x2 = tx + lineLen * Math.sin(angle);
      const y2 = ty - lineLen * Math.cos(angle);

      svg.append('line')
        .attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
        .attr('stroke', '#f43f5e').attr('stroke-width', 4);
      
      svg.append('circle').attr('cx', tx).attr('cy', ty).attr('r', 5).attr('fill', '#f43f5e');
    }

    if (viewMode === 'sector') {
      const arcPath = `M ${center.x} ${center.y} L ${center.x + radius} ${center.y} A ${radius} ${radius} 0 0 1 ${center.x + radius * Math.cos(Math.PI/3)} ${center.y - radius * Math.sin(Math.PI/3)} Z`;
      svg.append('path').attr('d', arcPath).attr('fill', 'rgba(16, 185, 129, 0.2)').attr('stroke', '#10b981').attr('stroke-width', 2);
    }

    // Radius Handle
    const dragRadius = drag<SVGCircleElement, any>().on('drag', (event) => {
      const dx = event.x - center.x;
      const dy = event.y - center.y;
      const newR = Math.max(20, Math.min(180, Math.sqrt(dx*dx + dy*dy)));
      setCircle(p => ({ ...p, radius: newR }));
    });

    const dragCenter = drag<SVGCircleElement, any>().on('drag', (event) => {
      setCircle(p => ({ ...p, center: { x: Math.max(radius, Math.min(width-radius, event.x)), y: Math.max(radius, Math.min(height-radius, event.y)) } }));
    });

    svg.append('circle').attr('cx', center.x).attr('cy', center.y).attr('r', 8).attr('fill', '#8b5cf6').attr('stroke', 'white').attr('stroke-width', 2).attr('cursor', 'move').call(dragCenter as any);
    svg.append('circle').attr('cx', center.x + radius).attr('cy', center.y).attr('r', 10).attr('fill', '#f43f5e').attr('stroke', 'white').attr('stroke-width', 2).attr('cursor', 'ew-resize').call(dragRadius as any);

    setStats({
      circumference: 2 * Math.PI * radius,
      area: Math.PI * radius * radius,
      diameter: radius * 2
    });

  }, [circle, viewMode]);

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-8">
      <div className="flex flex-col xl:flex-row gap-10 items-center">
        <div className="relative bg-slate-950/80 rounded-[2rem] p-4 border border-white/5 shadow-inner">
          <svg ref={svgRef} width="400" height="400" viewBox="0 0 400 400" className="max-w-full h-auto"></svg>
        </div>
        
        <div className="space-y-6 flex-1 w-full">
          <div className="grid grid-cols-2 gap-4">
            <ResultItem label="Radius" value={Math.round(circle.radius)} color="text-rose-400" isHighlighted={viewMode === 'basics'} />
            <ResultItem label="Diameter" value={Math.round(stats.diameter)} color="text-indigo-400" isHighlighted={viewMode === 'basics'} />
            <ResultItem label="Circumf." value={Math.round(stats.circumference)} color="text-violet-400" isHighlighted={viewMode === 'basics'} />
            <ResultItem label="Area" value={Math.round(stats.area)} unit="px²" color="text-emerald-400" isHighlighted={viewMode === 'basics'} />
          </div>
          
          <div className={`p-5 rounded-2xl border transition-all ${viewMode !== 'basics' ? 'bg-violet-500/10 border-violet-500' : 'bg-violet-500/5 border-violet-500/10'}`}>
            <p className="text-[10px] font-black text-violet-400 uppercase mb-2">Math Concept: {viewMode.toUpperCase()}</p>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              {viewMode === 'basics' && "The radius is the distance from the center to the edge. All points on a circle are equidistant from the center."}
              {viewMode === 'tangent' && "A tangent is a straight line that touches the circle at exactly ONE point and is perpendicular to the radius at that point."}
              {viewMode === 'sector' && "A sector is a portion of a circle enclosed by two radii and an arc—think of it as a slice of pizza!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ label, value, unit = 'px', color, isHighlighted }: any) => (
  <div className={`p-4 rounded-2xl border transition-all ${isHighlighted ? 'bg-white/15 border-violet-500 scale-105' : 'bg-white/5 border-white/5'}`}>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className={`text-2xl font-black ${color}`}>{value}</span>
      <span className="text-[9px] text-slate-600 font-bold uppercase">{unit}</span>
    </div>
  </div>
);

export default CircleSandbox;

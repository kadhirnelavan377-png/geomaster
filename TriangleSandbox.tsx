
import React, { useEffect, useRef, useState } from 'react';
import { select, drag } from 'd3';
import { Point, TriangleState, LessonType } from './types';

interface TriangleSandboxProps {
  activeLesson?: LessonType;
}

const TriangleSandbox: React.FC<TriangleSandboxProps> = ({ activeLesson }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [triangle, setTriangle] = useState<TriangleState>({
    a: { x: 200, y: 80 },
    b: { x: 80, y: 320 },
    c: { x: 320, y: 320 }
  });

  const [metrics, setMetrics] = useState({
    area: 0, perimeter: 0,
    inradius: 0,
    incenter: { x: 0, y: 0 }
  });

  const getDistance = (p1: Point, p2: Point) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    const { a, b, c } = triangle;
    const sideA = getDistance(b, c);
    const sideB = getDistance(a, c);
    const sideC = getDistance(a, b);
    const perimeter = sideA + sideB + sideC;
    const s = perimeter / 2;
    const area = Math.sqrt(Math.max(0, s * (s - sideA) * (s - sideB) * (s - sideC)));
    
    const incenter = {
      x: (sideA * a.x + sideB * b.x + sideC * c.x) / perimeter,
      y: (sideA * a.y + sideB * b.y + sideC * c.y) / perimeter
    };

    const inradius = area / s;

    // Draw Triangle
    svg.append('path')
      .attr('d', `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y} Z`)
      .attr('fill', 'rgba(16, 185, 129, 0.05)')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round');

    // Draw Incircle
    svg.append('circle')
      .attr('cx', incenter.x).attr('cy', incenter.y).attr('r', inradius)
      .attr('fill', 'rgba(56, 189, 248, 0.1)')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5');

    // Draw Bisectors
    const drawLine = (p1: Point, p2: Point) => {
      svg.append('line')
        .attr('x1', p1.x).attr('y1', p1.y).attr('x2', p2.x).attr('y2', p2.y)
        .attr('stroke', 'rgba(255,255,255,0.2)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2');
    };
    drawLine(a, incenter);
    drawLine(b, incenter);
    drawLine(c, incenter);

    // Interaction
    const createDrag = (key: keyof TriangleState) => drag<SVGCircleElement, any>().on('drag', (event) => {
      setTriangle(prev => ({ ...prev, [key]: { x: Math.max(20, Math.min(380, event.x)), y: Math.max(20, Math.min(380, event.y)) } }));
    });

    const drawPoint = (p: Point, key: keyof TriangleState, color: string) => {
      svg.append('circle')
        .attr('cx', p.x).attr('cy', p.y).attr('r', 10)
        .attr('fill', color).attr('stroke', 'white').attr('stroke-width', 2)
        .attr('cursor', 'pointer').call(createDrag(key) as any);
    };

    drawPoint(a, 'a', '#10b981');
    drawPoint(b, 'b', '#10b981');
    drawPoint(c, 'c', '#10b981');

    svg.append('circle').attr('cx', incenter.x).attr('cy', incenter.y).attr('r', 5).attr('fill', '#38bdf8').attr('stroke', 'white');

    setMetrics({ area, perimeter, inradius, incenter });
  }, [triangle]);

  return (
    <div className="bg-slate-900/50 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
      <div className="flex flex-col xl:flex-row gap-12">
        <div className="bg-slate-950 p-4 rounded-[2rem] border border-white/5 shadow-inner">
          <svg ref={svgRef} width="400" height="400" viewBox="0 0 400 400" className="max-w-full h-auto"></svg>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <DataCard label="Inradius" value={Math.round(metrics.inradius)} color="text-sky-400" />
             <DataCard label="Area" value={Math.round(metrics.area)} color="text-emerald-400" />
             <DataCard label="Semiperimeter" value={Math.round(metrics.perimeter / 2)} color="text-amber-400" />
             <DataCard label="Incenter" value={`${Math.round(metrics.incenter.x)}, ${Math.round(metrics.incenter.y)}`} color="text-white" />
          </div>

          <div className="p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-3xl space-y-3">
             <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">The Golden Rule</h4>
             <div className="text-3xl font-black text-white italic text-center py-4 border-y border-white/5">Area = r × s</div>
             <p className="text-[10px] text-slate-500 text-center uppercase font-bold tracking-widest">Inradius × Semiperimeter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataCard = ({ label, value, color }: any) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-xl font-black ${color}`}>{value}</p>
  </div>
);

export default TriangleSandbox;

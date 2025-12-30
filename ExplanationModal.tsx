
import React from 'react';
import { X, Compass, Triangle as TriangleIcon, Circle, Target, Ruler, Info } from 'lucide-react';
import { LabType } from './types';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  labMode: LabType;
}

const TriangleGuide = () => (
  <div className="space-y-6">
    <p className="text-lg text-emerald-400 font-bold">The Incircle is the largest circle that can fit inside a triangle.</p>
    <div className="space-y-4 text-slate-300">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
        <h3 className="text-white font-black uppercase text-sm mb-2">1. The Incenter</h3>
        <p>The Incenter is the center of the circle. We find it by drawing the <strong>Angle Bisectors</strong> of all three corners. Where they meet is the exact center!</p>
      </div>
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
        <h3 className="text-white font-black uppercase text-sm mb-2">2. The Inradius (r)</h3>
        <p>The Inradius is the distance from the Incenter to any side of the triangle. It is always perpendicular to the side it touches.</p>
      </div>
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
        <h3 className="text-white font-black uppercase text-sm mb-2">3. The Magic Formula</h3>
        <p className="text-2xl text-center py-4 text-white font-black italic">Area = r × s</p>
        <p>Here, 'r' is the inradius and 's' is the semiperimeter (half of the total perimeter). This formula connects the circle and the triangle perfectly!</p>
      </div>
    </div>
  </div>
);

const CircleGuide = () => (
  <div className="space-y-6">
    <p className="text-lg text-violet-400 font-bold">Circles are the most perfect shapes in geometry.</p>
    <div className="space-y-4 text-slate-300">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
        <h3 className="text-white font-black uppercase text-sm mb-2">1. Radius & Diameter</h3>
        <p>The Radius is the distance from the center to the edge. The Diameter is twice the radius and goes from one side to the other through the center.</p>
      </div>
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
        <h3 className="text-white font-black uppercase text-sm mb-2">2. Tangent Lines</h3>
        <p>A Tangent is a line that touches the circle at exactly ONE point. It is very special because it always makes a 90° angle with the radius at that point.</p>
      </div>
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
        <h3 className="text-white font-black uppercase text-sm mb-2">3. Sectors</h3>
        <p>A Sector is like a slice of pizza. It is the area enclosed by two radii and an arc of the circle.</p>
      </div>
    </div>
  </div>
);

const ExplanationModal: React.FC<ExplanationModalProps> = ({ isOpen, onClose, labMode }) => {
  const isTriangle = labMode === LabType.TRIANGLE;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#020617] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className={`p-6 border-b border-white/5 flex justify-between items-center ${isTriangle ? 'bg-emerald-600/10' : 'bg-violet-600/10'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isTriangle ? 'bg-emerald-600' : 'bg-violet-600'}`}>
              {isTriangle ? <TriangleIcon className="text-white" size={24} /> : <Circle className="text-white" size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-black italic text-white tracking-tight">
                {isTriangle ? 'Triangle Incircle Guide' : 'Circle Masterclass'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-900/50 w-fit px-4 py-2 rounded-full border border-white/5">
            <Info size={12} /> Clear Lesson Content
          </div>
          
          {isTriangle ? <TriangleGuide /> : <CircleGuide />}
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
             {isTriangle ? (
               <>
                 <KeyPoint title="Bisectors" icon={<Compass className="text-emerald-400"/>} desc="Split angles in half." />
                 <KeyPoint title="Incenter" icon={<Target className="text-amber-400" />} desc="Center of the circle." />
                 <KeyPoint title="Tangency" icon={<Circle className="text-sky-400"/>} desc="Points where sides touch." />
               </>
             ) : (
               <>
                 <KeyPoint title="Radius" icon={<Ruler className="text-violet-400"/>} desc="Distance from center." />
                 <KeyPoint title="Tangent" icon={<Target className="text-rose-400" />} desc="Touches at one point." />
                 <KeyPoint title="Sector" icon={<Circle className="text-emerald-400"/>} desc="Slice of the circle." />
               </>
             )}
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-end">
          <button onClick={onClose} className={`px-8 py-3 text-white font-black rounded-xl transition-all shadow-lg uppercase tracking-widest text-xs ${isTriangle ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-violet-600 hover:bg-violet-500'}`}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

const KeyPoint = ({ title, icon, desc }: any) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 bg-slate-800 rounded-lg">{icon}</div>
      <h4 className="font-black text-white italic text-xs uppercase">{title}</h4>
    </div>
    <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default ExplanationModal;

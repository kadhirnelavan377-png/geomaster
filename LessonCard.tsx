
import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface LessonCardProps {
  type: string;
  isActive: boolean;
  onSelect: () => void;
  color?: 'violet' | 'emerald';
}

export const LessonCard: React.FC<LessonCardProps> = ({ type, isActive, onSelect, color = 'violet' }) => {
  const activeClasses = color === 'violet' 
    ? 'bg-violet-600 border-violet-400 shadow-violet-600/20' 
    : 'bg-emerald-600 border-emerald-400 shadow-emerald-600/20';
  
  const iconClasses = color === 'violet' ? 'text-violet-500' : 'text-emerald-500';

  return (
    <button 
      onClick={onSelect}
      className={`w-full text-left p-5 rounded-2xl border transition-all relative group overflow-hidden ${
        isActive 
          ? `${activeClasses} scale-[1.02] shadow-2xl translate-x-1` 
          : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-white/5'
      }`}
    >
      {isActive && (
        <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      )}
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg mb-3 transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-800'}`}>
          <BookOpen className={isActive ? 'text-white' : iconClasses} size={18} />
        </div>
        {isActive && <CheckCircle2 className="text-white/40" size={14} />}
      </div>
      <h4 className={`font-black text-xs tracking-tight leading-tight uppercase ${isActive ? 'text-white' : 'text-slate-400'}`}>{type}</h4>
    </button>
  );
};

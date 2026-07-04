import React from 'react';
import { useGlow } from '../../context/GlowContext';
import { Sparkles, Heart, BookOpen, Wind, Bell, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { activeToast } = useGlow();

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'challenge': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'mood': return <Heart className="w-5 h-5 text-pink-400" />;
      case 'journal': return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'breathe': return <Wind className="w-5 h-5 text-cyan-400" />;
      default: return <Bell className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed top-16 right-4 z-50 max-w-sm w-full animate-bounce sm:animate-none sm:transition-all sm:duration-300">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-2 border-purple-400/50 dark:border-purple-600/50 p-4 rounded-2xl shadow-xl shadow-purple-500/20 flex items-start gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/60 rounded-xl shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center justify-between">
            {activeToast.title}
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">Ahora</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
            {activeToast.message}
          </p>
        </div>
      </div>
    </div>
  );
};

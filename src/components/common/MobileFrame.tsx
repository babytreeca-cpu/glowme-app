import React from 'react';
import { useGlow } from '../../context/GlowContext';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobileFrame, currentScreen } = useGlow();

  const isFullscreenScreen = ['splash', 'welcome', 'login', 'register'].includes(currentScreen);

  if (!isMobileFrame || isFullscreenScreen) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-20 sm:pb-0">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 flex items-center justify-center transition-colors">
      {/* Android Device Outer Frame */}
      <div className="relative w-full max-w-[420px] h-[860px] max-h-[92vh] bg-slate-950 rounded-[44px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col shrink-0">
        {/* Top Speaker / Camera Pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center gap-2 border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
          <div className="w-8 h-1 rounded-full bg-slate-800" />
        </div>

        {/* Screen Content */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-y-auto relative pt-6 pb-16 custom-scrollbar">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/50 rounded-full z-50" />
      </div>
    </div>
  );
};

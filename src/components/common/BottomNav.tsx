import React from 'react';
import { useGlow } from '../../context/GlowContext';
import { Home, Target, BookOpen, Gamepad2, Bot, Sparkles, User } from 'lucide-react';
import { ScreenType } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigate, user } = useGlow();

  if (!user || ['splash', 'welcome', 'login', 'register'].includes(currentScreen)) return null;

  const navItems: { screen: ScreenType; label: string; icon: any; badge?: string }[] = [
    { screen: 'home', label: 'Inicio', icon: Home },
    { screen: 'challenges', label: 'Retos', icon: Target },
    { screen: 'journal', label: 'Diario', icon: BookOpen },
    { screen: 'mirror', label: 'Espejo', icon: Sparkles, badge: 'IA' },
    { screen: 'games', label: 'Juegos', icon: Gamepad2 },
    { screen: 'chat', label: 'Glow IA', icon: Bot },
    { screen: 'profile', label: 'Perfil', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-purple-100 dark:border-purple-900/30 px-2 py-1.5 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-400 scale-105 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-purple-500 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive ? 'bg-purple-100 dark:bg-purple-900/50 shadow-sm shadow-purple-500/20' : ''
              }`}>
                <Icon className={`w-5 h-5 ${item.screen === 'mirror' && !isActive ? 'text-pink-500 animate-pulse' : ''}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-0 px-1 py-0.2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-extrabold rounded-full shadow-xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

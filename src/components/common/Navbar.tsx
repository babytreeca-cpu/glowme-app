import React from 'react';
import { useGlow } from '../../context/GlowContext';
import { Bell, Sparkles, Flame, Smartphone, Moon, Sun, Volume2, VolumeX, Menu } from 'lucide-react';

export const Navbar: React.FC<{ onOpenMenu?: () => void }> = ({ onOpenMenu }) => {
  const { 
    user, 
    navigate, 
    unreadNotifCount, 
    isDarkMode, 
    toggleDarkMode, 
    isMobileFrame, 
    toggleMobileFrame, 
    soundMuted, 
    toggleSound 
  } = useGlow();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-purple-100 dark:border-purple-900/30 px-4 py-3 transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Brand & Menu */}
        <div className="flex items-center gap-3">
          {onOpenMenu && (
            <button 
              onClick={onOpenMenu}
              className="p-2 -ml-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors"
              title="Menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              G
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
                GlowMe
              </span>
              <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-medium -mt-1">
                Nivel {user.level} ✨
              </span>
            </div>
          </button>
        </div>

        {/* Center: Gamification stats */}
        <div className="flex items-center gap-2 md:gap-4 bg-purple-50 dark:bg-purple-950/50 px-3 py-1.5 rounded-full border border-purple-100 dark:border-purple-800/40 text-xs font-semibold">
          {/* Streak */}
          <div className="flex items-center gap-1 text-orange-500 font-bold" title="Racha consecutiva">
            <Flame className="w-4 h-4 fill-orange-500 animate-pulse" />
            <span>{user.streakDays}d</span>
          </div>
          <div className="w-px h-3 bg-purple-200 dark:bg-purple-800" />
          {/* XP */}
          <div className="flex items-center gap-1 text-purple-700 dark:text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>{user.xp} <span className="hidden sm:inline">XP</span></span>
          </div>
          <div className="w-px h-3 bg-purple-200 dark:bg-purple-800" />
          {/* Coins */}
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
            <span className="text-sm">💎</span>
            <span>{user.coins}</span>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors"
            title={soundMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-purple-500" />}
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors"
            title="Cambiar Modo Oscuro/Claro"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          <button
            onClick={toggleMobileFrame}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors hidden sm:block"
            title="Vista Móvil / Escritorio"
          >
            <Smartphone className={`w-4 h-4 ${isMobileFrame ? 'text-purple-600 dark:text-purple-400' : ''}`} />
          </button>

          <button
            onClick={() => navigate('notifications')}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
            )}
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => navigate('profile')}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500 hover:scale-105 transition-transform ml-1"
          >
            <img 
              src={user.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
              alt={user.name} 
              className="w-full h-full object-cover" 
            />
          </button>
        </div>
      </div>
    </header>
  );
};

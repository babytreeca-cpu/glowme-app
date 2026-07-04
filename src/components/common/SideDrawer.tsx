import React from 'react';
import { useGlow } from '../../context/GlowContext';
import { ScreenType } from '../../types';
import { 
  X, 
  Home, 
  Target, 
  BookOpen, 
  Music, 
  Gamepad2, 
  Bot, 
  Flower2, 
  Award, 
  BarChart2, 
  Bell, 
  Settings, 
  LogOut, 
  Sparkle, 
  Quote as QuoteIcon,
  Smile
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const { user, currentScreen, navigate, logout } = useGlow();

  if (!isOpen || !user) return null;

  const menuItems: { screen: ScreenType; label: string; icon: any; badge?: string; color: string }[] = [
    { screen: 'home', label: 'Inicio Principal', icon: Home, color: 'text-purple-500' },
    { screen: 'mirror', label: 'Modo Espejo Inteligente', icon: Sparkle, badge: 'NUEVO ✨', color: 'text-pink-500 font-bold' },
    { screen: 'challenges', label: 'Retos Diarios', icon: Target, color: 'text-amber-500' },
    { screen: 'journal', label: 'Diario Emocional IA', icon: BookOpen, color: 'text-indigo-500' },
    { screen: 'music', label: 'Música & Calma', icon: Music, color: 'text-cyan-500' },
    { screen: 'games', label: 'Juegos de Autoestima', icon: Gamepad2, color: 'text-rose-500' },
    { screen: 'chat', label: 'Chatbot Glow IA', icon: Bot, color: 'text-violet-500' },
    { screen: 'garden', label: 'Jardín del Crecimiento', icon: Flower2, color: 'text-emerald-500' },
    { screen: 'avatar', label: 'Personalizar Avatar', icon: Smile, color: 'text-fuchsia-500' },
    { screen: 'achievements', label: 'Mis Logros & Insignias', icon: Award, color: 'text-yellow-500' },
    { screen: 'statistics', label: 'Estadísticas & Progreso', icon: BarChart2, color: 'text-blue-500' },
    { screen: 'quotes', label: 'Frases Positivas', icon: QuoteIcon, color: 'text-teal-500' },
    { screen: 'notifications', label: 'Notificaciones', icon: Bell, color: 'text-pink-400' },
    { screen: 'settings', label: 'Configuración', icon: Settings, color: 'text-slate-500' }
  ];

  const handleNav = (screen: ScreenType) => {
    navigate(screen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl border-r border-purple-100 dark:border-purple-900/30 flex flex-col z-10 overflow-hidden animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-white/80 overflow-hidden shadow-md shrink-0 bg-purple-800">
              <img 
                src={user.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                alt={user.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-lg truncate">{user.name}</h3>
              <p className="text-xs text-purple-100 font-medium truncate">{user.email}</p>
              <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                <span>⭐ Nivel {user.level}</span>
                <span>•</span>
                <span>🔥 {user.streakDays} d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-purple-500 uppercase">
            Explora GlowMe
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => handleNav(item.screen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive 
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold shadow-sm shadow-purple-500/10' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="my-2 border-t border-purple-100 dark:border-purple-900/30" />

          <button
            onClick={() => { onClose(); logout(); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-purple-50 dark:bg-slate-950/60 text-center text-[10px] text-slate-500 dark:text-slate-400 border-t border-purple-100 dark:border-purple-900/30">
          GlowMe App v2.5 • Hecho con 💜 para Adolescentes
        </div>
      </div>
    </div>
  );
};

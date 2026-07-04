import React, { useState } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Bell, Check, Trash2, ArrowLeft, Heart, Sparkles, Trophy, Flame, Zap } from 'lucide-react';
import { AppNotification } from '../../types';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigate } = useGlow();
  const [filter, setFilter] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todas' },
    { id: 'achievement', label: '🏆 Logros' },
    { id: 'streak', label: '🔥 Racha' },
    { id: 'reminder', label: '⏰ Recordatorios' },
    { id: 'system', label: '✨ Sistema' }
  ];

  const filtered = filter === 'todos'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'streak': return <Flame className="w-5 h-5 text-rose-500" />;
      case 'reminder': return <Heart className="w-5 h-5 text-pink-500" />;
      default: return <Sparkles className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Inicio</span>
        </button>

        <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
          <Bell className="w-4 h-4" />
          <span>Centro de Notificaciones Glow</span>
        </span>

        <button
          onClick={markAllNotificationsRead}
          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
        >
          Leídas todo
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">¡Bandeja de Buenas Vibras! 📬✨</h1>
          <p className="text-xs sm:text-sm text-purple-100 font-medium max-w-md mt-1">
            Mantente al tanto de tus rachas diarias, logros desbloqueados y mensajes motivacionales preparados para ti.
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
          🔔
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all whitespace-nowrap ${
              filter === c.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-purple-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-purple-100 text-slate-500 font-medium text-sm">
            No tienes notificaciones pendientes en esta categoría. ✨
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !item.read
                  ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-400 ring-1 ring-purple-400 font-bold'
                  : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-900/30 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white truncate">
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {!item.read && (
                <span className="text-[10px] font-black text-purple-600 bg-purple-100 px-2 py-1 rounded-lg shrink-0">
                  NUEVO
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

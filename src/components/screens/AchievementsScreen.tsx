import React, { useState } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Award, Sparkles, Flame, CheckCircle, Trophy, Lock, ArrowLeft, Star, Heart } from 'lucide-react';

export const AchievementsScreen: React.FC = () => {
  const { achievements, user, navigate } = useGlow();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  if (!user) return null;

  const categories = ['todos', 'General', 'Constancia', 'Retos', 'Diario', 'Juegos', 'Espejo', 'Social'];

  const filtered = selectedCategory === 'todos'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

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

        <span className="text-xs font-black uppercase tracking-wider text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
          <Trophy className="w-4 h-4" />
          <span>Salón de Fama GlowMe</span>
        </span>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            Progreso total: {unlockedCount} de {totalCount} logrados
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">¡Tus Insignias Mágicas! 🏆</h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-md mt-1">
            Cada hito importante de tu crecimiento personal desbloquea una insignia dorada permanente y recompensas exclusivas en XP y Monedas.
          </p>
        </div>

        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 border-4 border-white/40 flex flex-col items-center justify-center shrink-0 shadow-inner">
          <span className="text-4xl">🏅</span>
          <span className="text-[11px] font-black uppercase mt-1">{Math.round((unlockedCount / (totalCount || 1)) * 100)}%</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold capitalize transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filtered.map((item) => {
          const isDone = item.unlocked;
          const percent = Math.min(100, Math.round((item.progress / (item.maxProgress || 1)) * 100));
          return (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border flex items-start gap-4 transition-all ${
                isDone
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-900/30 opacity-75'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 mt-0.5 shadow-sm ${
                isDone ? 'bg-gradient-to-tr from-yellow-400 to-amber-500 text-white animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {isDone ? '🏆' : '🔒'}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {item.category}
                  </span>
                  {isDone && (
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Desbloqueada
                    </span>
                  )}
                </div>

                <h4 className="font-black text-sm text-slate-800 dark:text-white mt-0.5 truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-tight">
                  {item.description}
                </p>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>Progreso:</span>
                    <span>{item.progress} / {item.maxProgress} ({percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2 text-[11px] font-extrabold">
                  <span className="text-purple-600 dark:text-purple-400">⭐ +{item.xpReward} XP</span>
                  <span className="text-amber-600 dark:text-amber-400">💎 +{item.coinReward} Monedas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

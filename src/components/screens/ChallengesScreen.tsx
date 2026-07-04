import React, { useState } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Target, CheckCircle, Circle, Sparkles, RefreshCw, ArrowLeft, Award, Zap, Smile, Wind, Heart, Star, Sun } from 'lucide-react';

export const ChallengesScreen: React.FC = () => {
  const { dailyChallenges, toggleChallenge, generateNewChallenges, navigate, user } = useGlow();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateNewChallenges();
    setIsGenerating(false);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Smile': return <Smile className="w-5 h-5 text-amber-500" />;
      case 'Wind': return <Wind className="w-5 h-5 text-cyan-500" />;
      case 'Heart': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'Star': return <Star className="w-5 h-5 text-yellow-500" />;
      default: return <Sun className="w-5 h-5 text-purple-500" />;
    }
  };

  const completedCount = dailyChallenges.filter(c => c.completed).length;
  const totalCount = dailyChallenges.length;

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

        <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
          🎯 Retos Diarios Gamificados
        </span>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wide">
            Progreso de hoy: {completedCount} de {totalCount}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">¡Cumple tus Retos! 🔥</h1>
          <p className="text-xs sm:text-sm text-purple-100 font-medium max-w-md mt-1">
            Cada pequeño acto de amor propio suma XP y monedas para personalizar tu avatar y hacer crecer tu jardín virtual.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-purple-900 font-extrabold text-xs shadow-lg hover:bg-purple-50 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-purple-600 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Creando con IA...' : 'Nuevos Retos IA'}</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40 shadow-xs flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span>Meta diaria de bienestar</span>
            <span>{Math.round((completedCount / (totalCount || 1)) * 100)}% completado</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / (totalCount || 1)) * 100}%` }}
            />
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 font-black text-sm flex items-center gap-1 shrink-0">
          <Award className="w-4 h-4" />
          <span>+{completedCount * 30} XP</span>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {dailyChallenges.map((challenge) => {
          const isDone = challenge.completed;
          return (
            <div
              key={challenge.id}
              onClick={() => toggleChallenge(challenge.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                isDone 
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/50 scale-[0.99] opacity-85' 
                  : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-900/40 shadow-sm hover:shadow-md hover:border-purple-300'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className={`p-3 rounded-2xl shrink-0 mt-0.5 ${isDone ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-purple-100 dark:bg-purple-900/50'}`}>
                  {getIcon(challenge.icon)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400">
                      {challenge.category}
                    </span>
                    {isDone && (
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                        ✨ ¡Superado!
                      </span>
                    )}
                  </div>

                  <h3 className={`font-black text-base mt-1 text-slate-800 dark:text-white truncate ${isDone ? 'line-through text-slate-500' : ''}`}>
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-relaxed">
                    {challenge.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2.5">
                    <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      ⭐ +{challenge.xp} XP
                    </span>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      💎 +{challenge.coins} Monedas
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {isDone ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-300 hover:border-purple-500 hover:text-purple-500 transition-colors">
                    <Circle className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom tip */}
      <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 text-center">
        <p className="text-xs text-pink-700 dark:text-pink-300 font-semibold">
          💡 <span className="font-bold">Consejo Glow:</span> No te presiones si un día no puedes completar todos los retos. Lo importante es ser constante y amable contigo mismo.
        </p>
      </div>
    </div>
  );
};

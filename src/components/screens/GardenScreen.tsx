import React from 'react';
import { useGlow } from '../../context/GlowContext';
import { Flower2, Sparkles, ArrowLeft, Lock, CheckCircle, Heart, Zap } from 'lucide-react';

export const GardenScreen: React.FC = () => {
  const { user, plantStages, currentPlantStage, navigate } = useGlow();

  if (!user) return null;

  // Next plant
  const nextPlant = plantStages.find(p => p.stage === currentPlantStage.stage + 1);
  const progressPercent = nextPlant
    ? Math.min(100, Math.max(0, ((user.xp - currentPlantStage.requiredXp) / (nextPlant.requiredXp - currentPlantStage.requiredXp || 1)) * 100))
    : 100;

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

        <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <Flower2 className="w-4 h-4" />
          <span>Jardín del Crecimiento</span>
        </span>
      </div>

      {/* Hero Current Stage Display */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-900 rounded-[36px] p-8 text-white shadow-2xl text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wide text-emerald-200 inline-block mb-4">
          Etapa Actual: Fase {currentPlantStage.stage} de 5
        </span>

        {/* Big Plant Icon */}
        <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-tr from-emerald-400/20 via-teal-400/20 to-amber-400/20 border-4 border-white/30 flex items-center justify-center text-7xl shadow-inner animate-bounce my-4">
          {currentPlantStage.icon}
        </div>

        <h1 className="text-3xl font-black tracking-tight">{currentPlantStage.name} 🌿✨</h1>
        <p className="text-sm text-emerald-100 font-medium max-w-md mx-auto mt-2 leading-relaxed">
          {currentPlantStage.description}
        </p>

        {/* Progress Bar to next stage */}
        {nextPlant ? (
          <div className="max-w-md mx-auto mt-6 bg-black/30 p-4 rounded-2xl border border-white/10 text-left">
            <div className="flex justify-between text-xs font-bold text-emerald-200 mb-1">
              <span>Siguiente evolución: {nextPlant.name} ({nextPlant.icon})</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-200 mt-1.5 text-center font-semibold">
              Te faltan {Math.max(0, nextPlant.requiredXp - user.xp)} XP para que tu jardín florezca de nuevo. ¡Haz un reto diario!
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto mt-6 bg-black/30 p-3.5 rounded-2xl border border-amber-400/40 text-amber-300 text-xs font-black">
            🌟 ¡Felicidades! Has alcanzado la fase máxima del Jardín GlowMe. Tu resiliencia es infinita.
          </div>
        )}
      </div>

      {/* Evolution Phases Grid */}
      <div className="space-y-3">
        <h3 className="font-black text-base text-slate-800 dark:text-white flex items-center justify-between">
          <span>Las 5 Fases del Crecimiento Emocional</span>
          <span className="text-xs font-bold text-slate-400">Desbloquea ganando XP</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {plantStages.map((plant) => {
            const isUnlocked = user.xp >= plant.requiredXp;
            const isCurrent = currentPlantStage.id === plant.id;
            return (
              <div
                key={plant.id}
                className={`p-4 rounded-3xl border text-center flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500 scale-105 shadow-md'
                    : isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/40 opacity-90'
                    : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Fase {plant.stage}</span>
                    {isUnlocked ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <div className="text-4xl my-2">{plant.icon}</div>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
                    {plant.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className={`text-[11px] font-bold ${isUnlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {isUnlocked ? '✨ Desbloqueado' : `${plant.requiredXp} XP req.`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Note */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 text-center space-y-2">
        <Heart className="w-6 h-6 text-pink-500 mx-auto fill-pink-500" />
        <h4 className="font-bold text-sm text-slate-800 dark:text-white">Al igual que una planta, tu autoestima necesita riego diario.</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Cada vez que escribes en tu diario, te miras con amor al espejo o completas un reto, estás alimentando tus raíces emocionales.
        </p>
      </div>
    </div>
  );
};

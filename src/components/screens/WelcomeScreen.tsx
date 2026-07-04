import React from 'react';
import { useGlow } from '../../context/GlowContext';
import { Sparkles, ArrowRight, UserCheck, ShieldCheck, Heart } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { navigate, loginAsGuest } = useGlow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50/50 to-pink-50 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-950 flex flex-col justify-between p-6 sm:p-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20">
            G
          </div>
          <span className="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">GlowMe</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Espacio Seguro</span>
        </div>
      </div>

      {/* Center Illustration & Message */}
      <div className="my-auto py-8 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-amber-500/20 flex items-center justify-center animate-pulse">
            <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-2xl shadow-purple-500/30 flex items-center justify-center text-6xl transform hover:scale-105 transition-transform">
              ✨🦋💜
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-2.5 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-800 flex items-center gap-1.5 animate-bounce">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">+100% Amor propio</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Bienvenida a <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent">GlowMe</span>
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-sm font-medium">
          Tu compañero diario para fortalecer tu autoestima, calmar tu mente con Inteligencia Artificial, jugar y descubrir la mejor versión de ti.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto w-full space-y-3">
        <button
          onClick={() => navigate('register')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white font-extrabold text-base shadow-xl shadow-purple-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <span>Crear mi cuenta gratis</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => navigate('login')}
          className="w-full py-3.5 px-6 rounded-2xl bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 font-bold text-sm border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 active:scale-[0.98] transition-all shadow-sm"
        >
          Iniciar Sesión
        </button>

        <button
          onClick={loginAsGuest}
          className="w-full py-3 px-6 rounded-2xl text-slate-500 dark:text-slate-400 font-semibold text-xs hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-center gap-1.5"
        >
          <UserCheck className="w-4 h-4" />
          <span>Continuar como invitado (probar todo al instante)</span>
        </button>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          Al continuar, aceptas que GlowMe es una app gamificada de bienestar y autoayuda, no un servicio médico psiquiátrico.
        </p>
      </div>
    </div>
  );
};

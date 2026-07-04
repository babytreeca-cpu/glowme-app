import React, { useEffect } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Sparkles, Heart } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { user, navigate, isLoading } = useGlow();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          navigate('home');
        } else {
          navigate('welcome');
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Main Logo Card */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-700">
        <div className="w-28 h-28 rounded-[36px] bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 p-1 shadow-2xl shadow-purple-500/50 mb-6 flex items-center justify-center animate-bounce">
          <div className="w-full h-full bg-slate-900 rounded-[32px] flex flex-col items-center justify-center text-white">
            <Sparkles className="w-12 h-12 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-300 via-pink-200 to-white bg-clip-text text-transparent mb-3">
          GlowMe
        </h1>
        
        <p className="text-lg text-purple-200 font-medium max-w-xs leading-relaxed italic">
          "Descubre la mejor versión de ti."
        </p>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-12 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] w-full" />
      </div>

      <div className="absolute bottom-5 text-xs text-purple-300/70 flex items-center gap-1 font-semibold">
        <span>Hecho con</span>
        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
        <span>para Adolescentes</span>
      </div>
    </div>
  );
};

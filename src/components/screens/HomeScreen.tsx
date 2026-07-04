import React from 'react';
import { useGlow } from '../../context/GlowContext';
import { 
  Sparkles, 
  Flame, 
  Target, 
  BookOpen, 
  Music, 
  Gamepad2, 
  Bot, 
  Award, 
  Flower2, 
  User, 
  ArrowRight, 
  Heart, 
  Sparkle, 
  CheckCircle,
  Smile,
  Zap
} from 'lucide-react';
import { MoodType, ScreenType } from '../../types';

export const HomeScreen: React.FC = () => {
  const { user, navigate, dailyChallenges, updateMood, quotes } = useGlow();

  if (!user) return null;

  const moods: { id: MoodType; label: string; emoji: string; color: string }[] = [
    { id: 'feliz', label: 'Feliz', emoji: '😄', color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300' },
    { id: 'relajado', label: 'Relajado', emoji: '😌', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300' },
    { id: 'motivado', label: 'Motivado', emoji: '🔥', color: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-300' },
    { id: 'normal', label: 'Normal', emoji: '😐', color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300' },
    { id: 'ansioso', label: 'Ansioso', emoji: '🌧️', color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300' },
    { id: 'triste', label: 'Triste', emoji: '😢', color: 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-300' },
    { id: 'cansado', label: 'Cansado', emoji: '😴', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300' }
  ];

  const incompleteCount = dailyChallenges.filter(c => !c.completed).length;
  const quoteOfTheDay = quotes.find(q => q.isFavorite) || quotes[0] || { text: 'La belleza comienza en el momento en que decides ser tú misma.', author: 'Coco Chanel' };

  const quickLinks: { screen: ScreenType; title: string; desc: string; icon: any; gradient: string; badge?: string }[] = [
    { screen: 'challenges', title: 'Retos Diarios', desc: `${incompleteCount} pendientes hoy`, icon: Target, gradient: 'from-purple-500 to-indigo-600', badge: incompleteCount > 0 ? `${incompleteCount}` : undefined },
    { screen: 'journal', title: 'Diario Emocional', desc: 'Análisis inteligente por IA', icon: BookOpen, gradient: 'from-pink-500 to-rose-500' },
    { screen: 'music', title: 'Música & Calma', desc: 'Sintetizador y playlists relax', icon: Music, gradient: 'from-cyan-500 to-blue-600' },
    { screen: 'games', title: 'Juegos de Autoestima', desc: 'Memoria, rompecabezas y más', icon: Gamepad2, gradient: 'from-amber-500 to-orange-500' },
    { screen: 'chat', title: 'Glow IA', desc: 'Tu amigo que te apoya', icon: Bot, gradient: 'from-violet-600 to-purple-700', badge: 'IA' },
    { screen: 'garden', title: 'Jardín de Crecimiento', desc: 'Mira tus plantas florecer', icon: Flower2, gradient: 'from-emerald-500 to-teal-600' },
    { screen: 'achievements', title: 'Logros', desc: '100+ insignias para ganar', icon: Award, gradient: 'from-yellow-500 to-amber-600' },
    { screen: 'profile', title: 'Mi Perfil & Avatar', desc: 'Personaliza tu estilo Glow', icon: User, gradient: 'from-fuchsia-500 to-pink-600' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* 1. Greeting & XP Progress Header Card */}
      <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-pink-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('avatar')}
              className="relative group shrink-0"
              title="Haz clic para personalizar tu avatar"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-white/80 overflow-hidden shadow-lg bg-purple-900 group-hover:scale-105 transition-transform">
                <img 
                  src={user.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-tr from-pink-500 to-amber-400 rounded-full text-white text-[10px] font-black shadow">
                ✨
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider">
                  Nivel {user.level} • Estrella Glow
                </span>
                {user.isGuest && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 text-[10px] font-bold">
                    Invitado
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">¡Hola, {user.name}! 🌟</h1>
              <p className="text-purple-100 text-xs sm:text-sm font-medium">
                "Hoy es un gran día para descubrir tu potencial mágico."
              </p>
            </div>
          </div>

          {/* Streak & XP right widget */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 font-black text-amber-300">
              <Flame className="w-5 h-5 fill-amber-300 animate-pulse" />
              <span className="text-base">{user.streakDays} días en racha</span>
            </div>
            <div className="text-right">
              <div className="flex justify-between sm:justify-end gap-2 text-xs font-bold text-purple-100">
                <span>Progreso XP</span>
                <span>{user.xp} / {user.xpNextLevel}</span>
              </div>
              <div className="w-32 sm:w-36 h-2 bg-black/20 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-amber-300 to-pink-300 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (user.xp / user.xpNextLevel) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Emotional State Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-purple-100 dark:border-purple-900/40 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>¿Cómo te sientes en este momento?</span>
          </h3>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-bold capitalize">
            Actual: {user.currentMood}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {moods.map((m) => {
            const isSelected = user.currentMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => updateMood(m.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                  isSelected 
                    ? `${m.color} ring-2 ring-purple-500 scale-105 font-black shadow-md` 
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-102'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1 transform transition-transform">{m.emoji}</span>
                <span className="text-[11px] font-bold tracking-tight">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Módulo Exclusivo: Modo Espejo Inteligente Card (DIFERENCIADOR) */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-xl shadow-pink-500/20 overflow-hidden group">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wide text-amber-200 uppercase">
              <Sparkle className="w-3.5 h-3.5 fill-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Módulo Exclusivo GlowMe</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Modo Espejo Inteligente 🪞✨</h2>
            <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
              Activa tu cámara frontal o espejo virtual por 30 segundos. Recibe afirmaciones en vivo y fortalece tu amor propio al mirarte a los ojos. ¡Gana +50 XP y +25 Monedas!
            </p>
          </div>

          <button
            onClick={() => navigate('mirror')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white text-purple-800 font-black text-sm shadow-xl hover:bg-purple-50 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 group-hover:shadow-pink-500/50"
          >
            <Sparkles className="w-5 h-5 text-pink-500 fill-pink-500" />
            <span>Mirarme al Espejo Ahora</span>
          </button>
        </div>
      </div>

      {/* 4. Positive Quote of the Day & Begin Challenge Call to Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quote Card */}
        <div className="bg-gradient-to-br from-purple-100 via-indigo-50 to-pink-100 dark:from-purple-950/40 dark:via-slate-900 dark:to-pink-950/40 p-5 rounded-3xl border border-purple-200 dark:border-purple-800/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                💡 Frase Inspiradora
              </span>
              <button 
                onClick={() => navigate('quotes')}
                className="text-xs text-purple-700 dark:text-purple-300 font-bold hover:underline"
              >
                Ver todas &rarr;
              </button>
            </div>
            <p className="text-slate-800 dark:text-slate-100 font-extrabold text-base sm:text-lg italic leading-snug">
              "{quoteOfTheDay.text}"
            </p>
          </div>
          <p className="text-right text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">
            — {quoteOfTheDay.author}
          </p>
        </div>

        {/* Challenge Call to Action Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-purple-100 dark:border-purple-900/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                <span>Retos del Día</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                {dailyChallenges.length - incompleteCount} / {dailyChallenges.length} completados
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              {incompleteCount > 0 ? `Tienes ${incompleteCount} retos por completar hoy` : '¡Completaste todos los retos de hoy! 🎉'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Cada reto suma puntos para hacer crecer tu planta en el Jardín del Crecimiento.
            </p>
          </div>

          <button
            onClick={() => navigate('challenges')}
            className="mt-4 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-extrabold text-sm shadow-md shadow-purple-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <span>{incompleteCount > 0 ? 'Comenzar Retos Ahora' : 'Ver Retos Superados'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Quick Access Grid */}
      <div>
        <h3 className="font-black text-lg text-slate-900 dark:text-white mb-3 tracking-tight flex items-center justify-between">
          <span>Explora todas las zonas GlowMe</span>
          <span className="text-xs font-semibold text-slate-400">8 Módulos Activos</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                className="relative group p-4 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 shadow-xs hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left flex flex-col justify-between overflow-hidden min-h-[120px]"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-500 text-white shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-purple-500/5 dark:bg-purple-500/10 group-hover:scale-150 transition-transform pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

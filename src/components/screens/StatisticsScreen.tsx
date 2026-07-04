import React from 'react';
import { useGlow } from '../../context/GlowContext';
import { BarChart2, TrendingUp, Calendar, Award, Flame, Smile, ArrowLeft, Heart, Zap, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const StatisticsScreen: React.FC = () => {
  const { user, journalEntries, achievements, dailyChallenges, navigate } = useGlow();

  if (!user) return null;

  // Mock 7 day mood trend data for Recharts
  const weeklyMoodData = [
    { day: 'Lun', moodVal: 70, name: 'Tranquilo' },
    { day: 'Mar', moodVal: 85, name: 'Feliz' },
    { day: 'Mié', moodVal: 60, name: 'Normal' },
    { day: 'Jue', moodVal: 90, name: 'Inspirado' },
    { day: 'Vie', moodVal: 95, name: 'Motivado' },
    { day: 'Sáb', moodVal: 100, name: 'Radiante ✨' },
    { day: 'Dom', moodVal: 88, name: 'Paz' }
  ];

  // Emotion distribution pie data
  const emotionDistData = [
    { name: 'Feliz / Inspirado', value: 45, color: '#8B5CF6' },
    { name: 'Paz / Relajado', value: 30, color: '#10B981' },
    { name: 'Motivado', value: 15, color: '#F59E0B' },
    { name: 'Reflexivo / Triste', value: 10, color: '#EC4899' }
  ];

  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

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
          <BarChart2 className="w-4 h-4" />
          <span>Estadísticas y Evolución</span>
        </span>
      </div>

      {/* Hero Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-purple-100 dark:border-purple-900/40 shadow-sm text-center">
          <span className="text-2xl">🔥</span>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">{user.streakDays} Días</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase">Racha de Fuego</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-purple-100 dark:border-purple-900/40 shadow-sm text-center">
          <span className="text-2xl">⭐</span>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">{user.xp} XP</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase">Experiencia Total</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-purple-100 dark:border-purple-900/40 shadow-sm text-center">
          <span className="text-2xl">📖</span>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">{journalEntries.length}</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase">Reflexiones Diario</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-purple-100 dark:border-purple-900/40 shadow-sm text-center">
          <span className="text-2xl">🏆</span>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">
            {achievements.filter(a => a.unlocked).length}
          </h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase">Insignias Ganadas</p>
        </div>
      </div>

      {/* Weekly Streak Tracker Grid */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>Constancia de la Semana</span>
          </h3>
          <span className="text-xs font-bold text-emerald-500">¡Muy bien, sigue así!</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center pt-2">
          {daysOfWeek.map((day, idx) => {
            const isActive = idx <= 5; // Simulating active streak
            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-slate-400">{day}</span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base transition-transform ${
                  isActive 
                    ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md scale-105' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {isActive ? '🔥' : '⏳'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recharts Area Chart: Mood Evolution */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span>Evolución de Tu Bienestar (Últimos 7 Días)</span>
          </h3>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">+18% vs semana previa</span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyMoodData}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#8884d8" fontSize={12} tickLine={false} />
              <YAxis stroke="#8884d8" fontSize={12} tickLine={false} domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1B4B', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="moodVal" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recharts Pie Chart & AI Insight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-purple-100 dark:border-purple-900/40 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-2">
            Distribución de Emociones
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {emotionDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {emotionDistData.map((e, idx) => (
              <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
                <span>{e.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white border border-purple-500/40 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block mb-1">
              ✨ Análisis Inteligente GlowMe
            </span>
            <h3 className="text-lg font-black leading-snug">Tu confianza va en ascenso constante 🚀</h3>
            <p className="text-xs text-purple-200 mt-2 font-medium leading-relaxed">
              Durante esta semana has registrado mayor calma después de realizar el ejercicio del <span className="font-bold text-white">Modo Espejo</span> y completar tus retos escolares.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs font-bold text-pink-300">
            <span>Recomendación: Sigue tu racha hoy</span>
            <span className="bg-pink-500 text-white px-2.5 py-1 rounded-full text-[10px]">
              +100 XP Semanal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

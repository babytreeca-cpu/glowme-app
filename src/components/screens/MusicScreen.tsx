import React, { useState } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Music, Play, Pause, SkipForward, Volume2, ArrowLeft, Heart, Sparkles, Headphones, Radio, Waves } from 'lucide-react';
import { MusicTrack } from '../../types';

export const MusicScreen: React.FC = () => {
  const { musicTracks, currentTrack, isPlayingMusic, playTrack, pauseTrack, togglePlay, navigate, triggerToast } = useGlow();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todas las pistas', icon: '🎧' },
    { id: 'Quiero relajarme', label: 'Quiero relajarme', icon: '😌' },
    { id: 'Necesito motivación', label: 'Necesito motivación', icon: '🔥' },
    { id: 'Tengo ansiedad', label: 'Tengo ansiedad', icon: '🌧️' },
    { id: 'Estoy feliz', label: 'Estoy feliz', icon: '😄' }
  ];

  const filteredTracks = selectedCategory === 'todos'
    ? musicTracks
    : musicTracks.filter(t => t.category === selectedCategory);

  const handleNextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = musicTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % musicTracks.length;
    playTrack(musicTracks[nextIndex]);
    triggerToast('Reproduciendo 🎶', `Ahora suena: ${musicTracks[nextIndex].title}`, 'breathe');
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

        <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
          <Headphones className="w-4 h-4" />
          <span>Zona Música & Calma</span>
        </span>
      </div>

      {/* 1. Main Player Card */}
      {currentTrack && (
        <div className={`bg-gradient-to-br ${currentTrack.coverGradient} rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden transition-all duration-500`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            {/* Cover art icon & frequency */}
            <div className="flex items-center gap-4">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black/30 backdrop-blur-md border-2 border-white/30 flex flex-col items-center justify-center text-4xl shadow-inner ${isPlayingMusic ? 'animate-pulse' : ''}`}>
                <span>🎧</span>
                <span className="text-[10px] font-black text-purple-200 mt-1 uppercase tracking-tighter">
                  {currentTrack.frequency} Hz
                </span>
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
                  {currentTrack.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1.5 tracking-tight">{currentTrack.title}</h2>
                <p className="text-xs sm:text-sm text-purple-100 font-bold">{currentTrack.artist}</p>
                <p className="text-xs text-white/80 mt-1 max-w-sm italic">"{currentTrack.description}"</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-white text-purple-900 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
                  title={isPlayingMusic ? "Pausar" : "Reproducir"}
                >
                  {isPlayingMusic ? <Pause className="w-6 h-6 fill-purple-900" /> : <Play className="w-6 h-6 fill-purple-900 ml-1" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                  title="Siguiente pista"
                >
                  <SkipForward className="w-5 h-5 fill-white" />
                </button>
              </div>

              {/* Waveform Equalizer animation */}
              <div className="flex items-center gap-1 h-6 px-3 py-1 bg-black/20 rounded-full">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 bg-white rounded-full transition-all duration-300 ${
                      isPlayingMusic ? `animate-[pulse_${0.4 + bar * 0.1}s_ease-in-out_infinite] h-${bar % 2 === 0 ? '4' : '6'}` : 'h-1 opacity-40'
                    }`}
                    style={{ height: isPlayingMusic ? `${Math.floor(Math.random() * 16) + 6}px` : '4px' }}
                  />
                ))}
                <span className="text-[10px] font-bold text-white/80 ml-1.5">
                  {isPlayingMusic ? 'EN VIVO' : 'PAUSADO'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Mood Categories Filter */}
      <div className="space-y-2">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
          Filtrar por tu emoción actual
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tracklist */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
          Lista de Pistas Ambientales ({filteredTracks.length})
        </h3>

        {filteredTracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          const isPlayingThis = isCurrent && isPlayingMusic;
          return (
            <div
              key={track.id}
              onClick={() => { playTrack(track); triggerToast('Música Activa 🎧', `Reproduciendo: ${track.title}`, 'breathe'); }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                isCurrent 
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500 font-bold' 
                  : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-900/30 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.coverGradient} flex items-center justify-center text-white shrink-0 shadow-sm ${isPlayingThis ? 'animate-bounce' : ''}`}>
                  {isPlayingThis ? <Waves className="w-6 h-6 animate-pulse" /> : <Music className="w-6 h-6" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-800 dark:text-white truncate">
                      {track.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400">
                      {track.frequency} Hz
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {track.artist} • <span className="italic">{track.category}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-400">{track.duration}</span>
                <button
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isPlayingThis 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-cyan-500 hover:text-white'
                  }`}
                >
                  {isPlayingThis ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info card */}
      <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40 text-center">
        <p className="text-xs text-cyan-800 dark:text-cyan-300 font-semibold">
          🧠 <span className="font-bold">Sintetizador Binaural GlowMe:</span> Nuestras frecuencias están generadas por Web Audio API en tiempo real para reducir el estrés escolar, armonizar tus ondas cerebrales y ayudarte a enfocar o dormir en paz.
        </p>
      </div>
    </div>
  );
};

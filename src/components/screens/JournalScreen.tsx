import React, { useState } from 'react';
import { useGlow } from '../../context/GlowContext';
import { BookOpen, Calendar, Clock, Smile, Send, Sparkles, ArrowLeft, Heart, CheckCircle, Trash2, ChevronRight } from 'lucide-react';
import { analyzeJournalEntry } from '../../services/aiService';
import { JournalEntry } from '../../types';

export const JournalScreen: React.FC = () => {
  const { user, journalEntries, addJournalEntry, navigate, triggerToast } = useGlow();
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [moodName, setMoodName] = useState('Inspirado');
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const emojis: { emoji: string; label: string }[] = [
    { emoji: '😄', label: 'Feliz' },
    { emoji: '😌', label: 'Paz / Relajado' },
    { emoji: '🔥', label: 'Motivado' },
    { emoji: '✨', label: 'Inspirado' },
    { emoji: '😐', label: 'Normal / Tranquilo' },
    { emoji: '🌧️', label: 'Ansioso' },
    { emoji: '😢', label: 'Triste' },
    { emoji: '😴', label: 'Cansado' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) {
      triggerToast('Escribe algo ✍️', 'Cuéntanos un poco sobre cómo te sientes hoy.', 'system');
      return;
    }

    setIsAnalyzing(true);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Call Gemini AI
    const analysis = await analyzeJournalEntry(text, selectedEmoji, user.name);

    const newEntry: JournalEntry = {
      id: `j_${Date.now()}`,
      userId: user.uid,
      date: dateStr,
      time: timeStr,
      moodEmoji: selectedEmoji,
      moodName: moodName,
      text: text,
      aiAnalysis: analysis
    };

    await addJournalEntry(newEntry);
    setIsAnalyzing(false);
    setText('');
    setSelectedEntry(newEntry);
    setActiveTab('history');
  };

  if (!user) return null;

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

        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab('write'); setSelectedEntry(null); }}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'write'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-purple-100 dark:border-purple-900/40'
            }`}
          >
            ✍️ Escribir Hoy
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-purple-100 dark:border-purple-900/40'
            }`}
          >
            📖 Mi Historial ({journalEntries.length})
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-200">
          <BookOpen className="w-4 h-4" />
          <span>Diario Emocional Inteligente</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mt-1">Tu Espacio Privado de Reflexión ✨</h1>
        <p className="text-xs sm:text-sm text-purple-100 font-medium max-w-lg mt-1">
          Nuestra Inteligencia Artificial analiza compasivamente lo que escribes para entender tus emociones y ofrecerte consejos personalizados.
        </p>
      </div>

      {/* Tab 1: Write New Entry */}
      {activeTab === 'write' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-6">
          {/* Date & Time info */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 bg-purple-50 dark:bg-purple-950/50 p-3 rounded-2xl">
            <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
              <Calendar className="w-4 h-4" />
              <span>Fecha: {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Hora: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </span>
          </div>

          {/* Emoji selector */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              1. Selecciona tu estado de ánimo principal
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {emojis.map((item) => {
                const isSelected = selectedEmoji === item.emoji;
                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => { setSelectedEmoji(item.emoji); setMoodName(item.label); }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                      isSelected 
                        ? 'bg-purple-100 dark:bg-purple-900/60 border-purple-500 ring-2 ring-purple-500 scale-105 shadow-md font-bold' 
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-102'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{item.emoji}</span>
                    <span className="text-[10px] tracking-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text area */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              2. Expresa libremente tus pensamientos o lo que viviste hoy
            </label>
            <textarea
              required
              rows={6}
              placeholder="Ej: Hoy tuve un día increíble en la escuela porque logré exponer sin ponerme tan nervioso. Me siento muy orgulloso de mi esfuerzo..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white leading-relaxed resize-none font-medium"
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400 font-semibold">
              <span>Tu información es privada y está encriptada.</span>
              <span>{text.length} caracteres</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isAnalyzing || !text.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white font-black text-base shadow-xl shadow-purple-500/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
                <span>Analizando emociones con IA Glow...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Guardar y Analizar con IA ✨</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Tab 2: History & AI Analysis View */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* If there is a selected entry or recent analysis, show detail card */}
          {(selectedEntry || journalEntries[0]) ? (
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white border-2 border-purple-500/50 shadow-2xl relative overflow-hidden animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{(selectedEntry || journalEntries[0]).moodEmoji}</span>
                  <div>
                    <h3 className="font-black text-lg">{(selectedEntry || journalEntries[0]).moodName}</h3>
                    <p className="text-[11px] text-purple-300">
                      📅 {(selectedEntry || journalEntries[0]).date} • 🕒 {(selectedEntry || journalEntries[0]).time}
                    </p>
                  </div>
                </div>

                {(selectedEntry || journalEntries[0]).aiAnalysis && (
                  <span className="px-3 py-1 rounded-full bg-pink-500/30 border border-pink-400 text-pink-200 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>IA: {(selectedEntry || journalEntries[0]).aiAnalysis?.detectedEmotion}</span>
                  </span>
                )}
              </div>

              <div className="bg-white/5 p-4 rounded-2xl mb-4 italic text-sm text-purple-100 font-medium leading-relaxed">
                "{(selectedEntry || journalEntries[0]).text}"
              </div>

              {/* AI Recommendation Reflection */}
              {(selectedEntry || journalEntries[0]).aiAnalysis && (
                <div className="bg-purple-950/80 border border-purple-400/30 p-4 rounded-2xl space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-amber-300" />
                    <span>Reflexión de IA Glow</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white font-semibold leading-relaxed">
                    {(selectedEntry || journalEntries[0]).aiAnalysis?.summary}
                  </p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-pink-300">
                    <span>💡 Sugerencia: {(selectedEntry || journalEntries[0]).aiAnalysis?.recommendation}</span>
                    <span className="shrink-0 bg-pink-500 px-2 py-0.5 rounded-full text-white text-[10px]">
                      +{(selectedEntry || journalEntries[0]).aiAnalysis?.xpAwarded} XP
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* List of past entries */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider">
              Todas las entradas registradas
            </h3>
            {journalEntries.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-purple-100 dark:border-purple-900/40 text-slate-500">
                Aún no tienes entradas en tu diario. ¡Ve a la pestaña "Escribir Hoy" para registrar tu primera emoción!
              </div>
            ) : (
              journalEntries.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedEntry(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    selectedEntry?.id === item.id
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 ring-1 ring-purple-500'
                      : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-900/30 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                      {item.moodEmoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-white truncate">
                          {item.moodName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                        {item.text}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

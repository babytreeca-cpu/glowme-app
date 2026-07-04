import React, { useState } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Quote as QuoteIcon, Heart, Share2, Sparkles, RefreshCw, ArrowLeft, Palette, Check } from 'lucide-react';
import { fetchDailyQuote } from '../../services/aiService';

export const QuotesScreen: React.FC = () => {
  const { quotes, toggleFavoriteQuote, addCustomQuote, navigate, triggerToast } = useGlow();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [selectedBg, setSelectedBg] = useState('from-purple-600 via-indigo-600 to-pink-500');

  const gradients = [
    { name: 'Cosmic Purple', class: 'from-purple-600 via-indigo-600 to-pink-500', color: 'bg-purple-500' },
    { name: 'Sunset Rose', class: 'from-pink-500 via-rose-500 to-amber-500', color: 'bg-pink-500' },
    { name: 'Ocean Serenity', class: 'from-cyan-600 via-blue-600 to-indigo-700', color: 'bg-cyan-500' },
    { name: 'Emerald Forest', class: 'from-emerald-600 via-teal-600 to-indigo-800', color: 'bg-emerald-500' },
    { name: 'Golden Aura', class: 'from-amber-500 via-orange-600 to-purple-700', color: 'bg-amber-500' }
  ];

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    triggerToast('Inspiración IA ✨', 'Consultando al universo por una frase para ti...', 'system');
    const newQ = await fetchDailyQuote();
    const formatted = {
      id: `ai_${Date.now()}`,
      text: newQ.quote,
      author: newQ.author || 'GlowMe AI',
      category: newQ.category || 'Inspiración',
      isFavorite: false,
      bgGradient: selectedBg
    };
    addCustomQuote(formatted);
    setIsGenerating(false);
    setCurrentQuoteIndex(0);
  };

  const handleShare = (text: string, author: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`"${text}" — ${author} ✨ (vía GlowMe App)`);
      triggerToast('Frase Copiada 📋', 'Lista para compartir en tus redes o estados.', 'system');
    }
  };

  const displayList = activeTab === 'favorites'
    ? quotes.filter(q => q.isFavorite)
    : quotes;

  const currentQ = displayList[currentQuoteIndex] || quotes[0] || { text: 'El amor propio es el comienzo de un romance de por vida.', author: 'Oscar Wilde', id: 'default' };

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
            onClick={() => { setActiveTab('all'); setCurrentQuoteIndex(0); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-purple-100'
            }`}
          >
            Todas ({quotes.length})
          </button>
          <button
            onClick={() => { setActiveTab('favorites'); setCurrentQuoteIndex(0); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-purple-100'
            }`}
          >
            ❤️ Favoritas ({quotes.filter(q => q.isFavorite).length})
          </button>
        </div>
      </div>

      {/* Hero Featured Quote Card */}
      <div className={`bg-gradient-to-br ${currentQ.bgGradient || selectedBg} rounded-[36px] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px] transition-all duration-500 group`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider relative z-10 text-white/90">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md">
            <QuoteIcon className="w-4 h-4" />
            <span>{currentQ.category || 'Autoestima'}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShare(currentQ.text, currentQ.author)}
              className="p-2.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md transition-colors"
              title="Copiar / Compartir"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavoriteQuote(currentQ.id)}
              className="p-2.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md transition-colors"
              title="Guardar en Favoritas"
            >
              <Heart className={`w-4 h-4 ${currentQ.isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {/* Quote text */}
        <div className="my-auto py-6 relative z-10 text-center">
          <p className="text-2xl sm:text-3xl font-black leading-snug italic tracking-tight">
            "{currentQ.text}"
          </p>
          <p className="text-sm sm:text-base font-extrabold text-purple-200 mt-4">
            — {currentQ.author}
          </p>
        </div>

        {/* Navigation bottom */}
        <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/20">
          <button
            onClick={() => setCurrentQuoteIndex((currentQuoteIndex - 1 + displayList.length) % (displayList.length || 1))}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            &larr; Anterior
          </button>
          <span className="text-xs font-black">
            {displayList.length > 0 ? `${currentQuoteIndex + 1} de ${displayList.length}` : '0 de 0'}
          </span>
          <button
            onClick={() => setCurrentQuoteIndex((currentQuoteIndex + 1) % (displayList.length || 1))}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            Siguiente &rarr;
          </button>
        </div>
      </div>

      {/* Tools: Change Background & Generate with AI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Background gradient picker */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-purple-500" />
            <span>Personalizar Fondo de Tarjeta</span>
          </span>
          <div className="flex items-center gap-2 pt-1">
            {gradients.map((g) => (
              <button
                key={g.name}
                onClick={() => setSelectedBg(g.class)}
                className={`w-8 h-8 rounded-full ${g.color} border-2 transition-transform flex items-center justify-center ${
                  selectedBg === g.class ? 'scale-125 border-slate-900 dark:border-white shadow-md' : 'border-transparent hover:scale-110'
                }`}
                title={g.name}
              >
                {selectedBg === g.class && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* AI generator button */}
        <button
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="p-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <Sparkles className={`w-6 h-6 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generando con IA...' : 'Crear Frase con IA Glow ✨'}</span>
        </button>
      </div>

      {/* List of quotes */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
          Colección Inspiradora
        </h3>
        {displayList.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setCurrentQuoteIndex(idx)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
              currentQuoteIndex === idx 
                ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 ring-1 ring-purple-500' 
                : 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-900/30 hover:border-purple-300'
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                "{item.text}"
              </p>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5 block">
                — {item.author} • <span className="text-slate-400">{item.category}</span>
              </span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); toggleFavoriteQuote(item.id); }}
              className="p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-colors"
            >
              <Heart className={`w-5 h-5 ${item.isFavorite ? 'fill-pink-500 text-pink-500' : 'text-slate-300'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

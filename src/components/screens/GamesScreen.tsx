import React, { useState, useEffect } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Gamepad2, Award, Sparkles, RefreshCw, ArrowLeft, Heart, CheckCircle, Zap, Eye, Puzzle, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../services/soundService';

type GameType = 'menu' | 'memory' | 'puzzle' | 'concentration' | 'reflexes';

export const GamesScreen: React.FC = () => {
  const { user, addXp, addCoins, triggerToast, navigate } = useGlow();
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  // --- MEMORY GAME STATE ---
  const initialCards = [
    { id: 1, icon: '✨', name: 'Brillo', flipped: false, matched: false },
    { id: 2, icon: '✨', name: 'Brillo', flipped: false, matched: false },
    { id: 3, icon: '💜', name: 'Amor', flipped: false, matched: false },
    { id: 4, icon: '💜', name: 'Amor', flipped: false, matched: false },
    { id: 5, icon: '👑', name: 'Valor', flipped: false, matched: false },
    { id: 6, icon: '👑', name: 'Valor', flipped: false, matched: false },
    { id: 7, icon: '🔥', name: 'Fuerza', flipped: false, matched: false },
    { id: 8, icon: '🔥', name: 'Fuerza', flipped: false, matched: false },
    { id: 9, icon: '🌟', name: 'Estrella', flipped: false, matched: false },
    { id: 10, icon: '🌟', name: 'Estrella', flipped: false, matched: false },
    { id: 11, icon: '🌸', name: 'Calma', flipped: false, matched: false },
    { id: 12, icon: '🌸', name: 'Calma', flipped: false, matched: false },
  ];
  const [cards, setCards] = useState(() => [...initialCards].sort(() => Math.random() - 0.5));
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const resetMemory = () => {
    sound.playClick();
    setCards([...initialCards].map(c => ({ ...c, flipped: false, matched: false })).sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMoves(0);
  };

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2 || cards[index].flipped || cards[index].matched) return;
    sound.playClick();
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newSelected;
      if (newCards[first].icon === newCards[second].icon) {
        sound.playCoinWin();
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setSelectedCards([]);
        // check win
        if (newCards.every(c => c.matched)) {
          sound.playLevelUp();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          addXp(40, 'ganar el Juego de Memoria');
          addCoins(20);
          triggerToast('¡Memoria Superada! 🏆', '+40 XP y +20 Monedas ganadas.', 'challenge');
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // --- PUZZLE GAME STATE ---
  const originalWords = ["Soy", "una persona", "única,", "capaz de lograr", "todos mis sueños", "y merezco", "ser muy feliz. ✨"];
  const [puzzleWords, setPuzzleWords] = useState(() => [...originalWords].sort(() => Math.random() - 0.5));
  const [assembledWords, setAssembledWords] = useState<string[]>([]);

  const resetPuzzle = () => {
    sound.playClick();
    setPuzzleWords([...originalWords].sort(() => Math.random() - 0.5));
    setAssembledWords([]);
  };

  const selectWord = (word: string, index: number) => {
    sound.playClick();
    const newAssembled = [...assembledWords, word];
    setAssembledWords(newAssembled);
    setPuzzleWords(prev => prev.filter((_, i) => i !== index));

    // Check if finished
    if (newAssembled.length === originalWords.length) {
      if (newAssembled.join(' ') === originalWords.join(' ')) {
        sound.playLevelUp();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        addXp(35, 'armar el Rompecabezas de Afirmación');
        addCoins(20);
        triggerToast('¡Afirmación Completa! 🌟', '+35 XP y +20 Monedas.', 'challenge');
      } else {
        sound.playClick();
        triggerToast('Casi lo logras 💡', 'La frase no está en el orden correcto. Inténtalo de nuevo con cariño.', 'system');
      }
    }
  };

  // --- CONCENTRATION GAME STATE ---
  const [gridSize] = useState(16);
  const [targetIndex, setTargetIndex] = useState(Math.floor(Math.random() * 16));
  const [concScore, setConcScore] = useState(0);

  const resetConcentration = () => {
    sound.playClick();
    setTargetIndex(Math.floor(Math.random() * 16));
  };

  const handleConcentrationClick = (idx: number) => {
    if (idx === targetIndex) {
      sound.playCoinWin();
      const newScore = concScore + 10;
      setConcScore(newScore);
      setTargetIndex(Math.floor(Math.random() * 16));
      if (newScore % 30 === 0) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        addXp(25, 'gran concentración');
        addCoins(15);
        triggerToast('¡Ojo de Águila! 🎯', '+25 XP y +15 Monedas.', 'challenge');
      }
    } else {
      sound.playClick();
      triggerToast('Sigue buscando 👀', 'Encuentra el ícono diferente.', 'system');
    }
  };

  // --- REFLEXES GAME STATE ---
  const [reflexScore, setReflexScore] = useState(0);
  const [activeReflexPos, setActiveReflexPos] = useState({ x: 50, y: 50 });
  const [isReflexRunning, setIsReflexRunning] = useState(false);

  useEffect(() => {
    let timer: any;
    if (activeGame === 'reflexes' && isReflexRunning) {
      timer = setInterval(() => {
        setActiveReflexPos({
          x: Math.floor(Math.random() * 75) + 10,
          y: Math.floor(Math.random() * 65) + 15
        });
      }, 1100);
    }
    return () => clearInterval(timer);
  }, [activeGame, isReflexRunning]);

  const handleReflexTap = () => {
    if (!isReflexRunning) return;
    sound.playCoinWin();
    const newScore = reflexScore + 1;
    setReflexScore(newScore);
    setActiveReflexPos({
      x: Math.floor(Math.random() * 75) + 10,
      y: Math.floor(Math.random() * 65) + 15
    });
    if (newScore === 10 || newScore === 25) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      addXp(30, 'destreza en reflejos');
      addCoins(15);
      triggerToast('¡Súper Reflejos! ⭐', '+30 XP y +15 Monedas.', 'challenge');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (activeGame !== 'menu') setActiveGame('menu');
            else navigate('home');
          }}
          className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeGame !== 'menu' ? 'Volver a Juegos' : 'Inicio'}</span>
        </button>

        <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <Gamepad2 className="w-4 h-4" />
          <span>Zona Arcade de Bienestar</span>
        </span>
      </div>

      {/* MENU VIEW */}
      {activeGame === 'menu' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-rose-500 via-amber-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
            <h1 className="text-2xl sm:text-3xl font-black">¡Juega, Relájate y Gana Puntos! 🎮✨</h1>
            <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-lg mt-1">
              Todos nuestros juegos están diseñados psicológicamente para ejercitar tu concentración, memoria y pensamiento positivo mientras ganas monedas para tu avatar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => { setActiveGame('memory'); resetMemory(); }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all text-left flex items-start gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0 group-hover:scale-110 transition-transform">
                🃏
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">Memoria Brillante</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                  Encuentra las parejas de íconos de autoestima. Ideal para entrenar tu mente y agudeza.
                </p>
                <span className="inline-block mt-3 text-xs font-bold text-purple-600 dark:text-purple-400">Jugar ahora &rarr;</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveGame('puzzle'); resetPuzzle(); }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all text-left flex items-start gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0 group-hover:scale-110 transition-transform">
                🧩
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">Rompecabezas de Afirmación</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                  Ordena las piezas para armar una poderosa afirmación positiva que elevará tu día.
                </p>
                <span className="inline-block mt-3 text-xs font-bold text-pink-600 dark:text-pink-400">Jugar ahora &rarr;</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveGame('concentration'); resetConcentration(); }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all text-left flex items-start gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0 group-hover:scale-110 transition-transform">
                🦅
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">Ojo de Águila</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                  Encuentra el ícono positivo diferente entre los demás. Despierta tu atención plena.
                </p>
                <span className="inline-block mt-3 text-xs font-bold text-amber-600 dark:text-amber-400">Jugar ahora &rarr;</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveGame('reflexes'); setIsReflexRunning(true); setReflexScore(0); }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all text-left flex items-start gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0 group-hover:scale-110 transition-transform">
                ⭐
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">Lluvia de Estrellas</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                  Atrapa las estrellas luminosas de amor propio antes de que desaparezcan.
                </p>
                <span className="inline-block mt-3 text-xs font-bold text-cyan-600 dark:text-cyan-400">Jugar ahora &rarr;</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* GAME 1: MEMORIA */}
      {activeGame === 'memory' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-6 text-center">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Memoria Brillante 🃏</h2>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span>Movimientos: {moves}</span>
              <button onClick={resetMemory} className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Reiniciar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            {cards.map((c, i) => (
              <button
                key={i}
                onClick={() => handleCardClick(i)}
                disabled={c.flipped || c.matched}
                className={`h-20 sm:h-24 rounded-2xl text-3xl font-bold flex items-center justify-center transition-all duration-300 transform ${
                  c.flipped || c.matched
                    ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md scale-105'
                    : 'bg-purple-100 dark:bg-slate-800 text-transparent hover:bg-purple-200 border-2 border-purple-200 dark:border-slate-700'
                }`}
              >
                {(c.flipped || c.matched) ? c.icon : '❓'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 2: ROMPECABEZAS */}
      {activeGame === 'puzzle' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-6 text-center">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Rompecabezas de Afirmación 🧩</h2>
            <button onClick={resetPuzzle} className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Reiniciar
            </button>
          </div>

          <p className="text-xs text-slate-500 font-medium">Toca las palabras en el orden correcto para formar la frase positiva:</p>

          {/* Assembled Area */}
          <div className="min-h-[80px] p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border-2 border-dashed border-purple-300 flex flex-wrap items-center justify-center gap-2">
            {assembledWords.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Aquí aparecerá tu frase...</span>
            ) : (
              assembledWords.map((w, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-sm shadow-sm animate-in zoom-in-95">
                  {w}
                </span>
              ))
            )}
          </div>

          {/* Available Words */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {puzzleWords.map((w, i) => (
              <button
                key={i}
                onClick={() => selectWord(w, i)}
                className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 font-bold text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 3: CONCENTRATION */}
      {activeGame === 'concentration' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-6 text-center">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Ojo de Águila 🦅</h2>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-amber-500">Puntaje: {concScore}</span>
              <button onClick={resetConcentration} className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700">Reiniciar</button>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">¿Cuál de estos íconos es el único CORAZÓN brillante (💖)? ¡Encuéntralo rápido!</p>

          <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
            {Array.from({ length: gridSize }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleConcentrationClick(i)}
                className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-3xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              >
                {i === targetIndex ? '💖' : '💜'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 4: REFLEXES */}
      {activeGame === 'reflexes' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-4 text-center">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Lluvia de Estrellas ⭐</h2>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-cyan-500">Estrellas atrapadas: {reflexScore}</span>
              <button
                onClick={() => setIsReflexRunning(!isReflexRunning)}
                className="px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 font-bold"
              >
                {isReflexRunning ? 'Pausar' : 'Continuar'}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500">Haz clic en la estrella mágica cada vez que aparezca en el tablero:</p>

          <div className="relative w-full h-80 rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border-2 border-purple-500/30 overflow-hidden shadow-inner">
            {isReflexRunning && (
              <button
                onClick={handleReflexTap}
                style={{ left: `${activeReflexPos.x}%`, top: `${activeReflexPos.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 p-3 bg-gradient-to-tr from-amber-400 to-pink-500 rounded-full text-white shadow-[0_0_30px_rgba(245,158,11,0.8)] animate-bounce active:scale-75 transition-all duration-200"
              >
                <Star className="w-8 h-8 fill-white" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Sparkles, Camera, CameraOff, Play, CheckCircle, ArrowLeft, Heart, ShieldAlert, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../services/soundService';

export const SmartMirrorScreen: React.FC = () => {
  const { user, navigate, addXp, addCoins, triggerToast, achievements } = useGlow();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isMirrorActive, setIsMirrorActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const affirmations = [
    "Mírate a los ojos con cariño y repite: Soy una persona única y muy valiosa. ✨",
    "Repite en voz alta: Merezco ser feliz, estar en paz y alcanzar todos mis sueños. 💜",
    "Observa tu sonrisa: Mi confianza se fortalece cada día que pasa. 🌟",
    "Inhala profundamente y di: Perdono mis errores pasados y me permito brillar hoy. 🌸",
    "Siente tu fuerza interior: Soy capaz de superar cualquier reto en mi camino. 🔥"
  ];

  const floatingWords = ["Luz", "Valentía", "Amor Propio", "Paz", "Fuerza", "Resiliencia", "Magia", "Belleza"];

  // Start webcam
  const startCamera = async () => {
    sound.playClick();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
      startTimer();
    } catch (err) {
      console.warn('Camera access denied or unavailable, using glowing virtual mirror fallback:', err);
      setHasCameraPermission(false);
      startTimer();
    }
  };

  const startTimer = () => {
    setIsMirrorActive(true);
    setIsCompleted(false);
    setTimeLeft(30);
    setCurrentAffirmationIndex(0);
    triggerToast('Espejo Activo ✨', 'Comenzando sesión de 30 segundos de amor propio.', 'breathe');
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Timer interval
  useEffect(() => {
    let timer: any;
    if (isMirrorActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // rotate affirmations every 6 seconds
        if (timeLeft % 6 === 0) {
          setCurrentAffirmationIndex(i => (i + 1) % affirmations.length);
        }
      }, 1000);
    } else if (isMirrorActive && timeLeft === 0) {
      // Completed!
      setIsMirrorActive(false);
      setIsCompleted(true);
      stopCamera();
      sound.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981']
      });
      addXp(50, 'completar el Modo Espejo Inteligente');
      addCoins(25);
      triggerToast('¡Reto Espejo Completado! 🏆', '+50 XP y +25 Monedas para ti.', 'challenge');
    }
    return () => clearInterval(timer);
  }, [isMirrorActive, timeLeft]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { stopCamera(); navigate('home'); }}
          className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Inicio</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Módulo Exclusivo GlowMe</span>
        </div>
      </div>

      {/* Hero Intro */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/40 shadow-sm text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Modo Espejo Inteligente 🪞✨
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto font-medium">
          Una actividad guiada y novedosa donde te invitarás a mirarte durante 30 segundos mientras recibes afirmaciones positivas en vivo. <span className="text-purple-600 dark:text-purple-400 font-bold">¡Tu imagen NO se almacena ni se graba! Es un espacio privado 100% seguro.</span>
        </p>
      </div>

      {/* Mirror Stage */}
      <div className="relative rounded-[36px] bg-slate-950 border-4 border-purple-500/40 shadow-2xl overflow-hidden aspect-4/3 sm:aspect-video flex flex-col items-center justify-center">
        {/* Video feed or fallback glowing mirror */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity duration-500 ${
            hasCameraPermission && isMirrorActive ? 'opacity-90' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Fallback Animated Glowing Mirror if no camera */}
        {(!hasCameraPermission || !isMirrorActive) && !isCompleted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/80 via-indigo-950 to-pink-900/80 p-6 text-center">
            <div className="w-40 h-40 rounded-full border-4 border-pink-400/40 bg-gradient-to-tr from-purple-500/20 via-pink-500/30 to-amber-500/20 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite] shadow-[0_0_60px_rgba(236,72,153,0.3)] mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-5xl shadow-inner">
                🪞✨
              </div>
            </div>
            <h3 className="text-xl font-black text-white">Tu Espejo Virtual de Luz</h3>
            <p className="text-xs text-purple-200 mt-1 max-w-xs">
              {hasCameraPermission === false
                ? "Cámara no detectada o permiso denegado. ¡No te preocupes! Hemos activado el Espejo de Luz Guiada."
                : "Haz clic en el botón de abajo para encender el espejo y comenzar tu momento de conexión."}
            </p>
          </div>
        )}

        {/* Active Timer Overlay & Affirmation Banner */}
        {isMirrorActive && (
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 pointer-events-none">
            {/* Top timer bar */}
            <div className="flex items-center justify-between">
              <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-extrabold text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                <span>En vivo: {timeLeft}s</span>
              </div>
              
              <div className="px-3 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-white text-xs font-bold">
                +50 XP en juego
              </div>
            </div>

            {/* Floating positive bubbles */}
            <div className="absolute top-1/3 left-6 animate-bounce text-pink-300 font-extrabold text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              ✨ Eres valiosa
            </div>
            <div className="absolute top-1/2 right-6 animate-pulse text-amber-300 font-extrabold text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm delay-500">
              💜 Fuerza interior
            </div>

            {/* Bottom Affirmation Activity Card */}
            <div className="bg-black/75 backdrop-blur-md border border-purple-500/50 p-4 sm:p-5 rounded-2xl text-center max-w-xl mx-auto shadow-2xl animate-in fade-in duration-500">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 block mb-1">
                Actividad de Afirmación ({currentAffirmationIndex + 1}/5)
              </span>
              <p className="text-base sm:text-lg font-black text-white leading-snug">
                "{affirmations[currentAffirmationIndex]}"
              </p>
            </div>
          </div>
        )}

        {/* Completion Celebration Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 z-30 bg-gradient-to-br from-purple-950/95 via-indigo-950/95 to-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-black text-white mb-2">¡Reto Espejo Superado! 🌟</h2>
            <p className="text-purple-200 text-sm max-w-md font-medium">
              Has dedicado 30 segundos a reconocer tu valor y cultivar tu autoestima. Eres increíble, {user.name}.
            </p>

            <div className="flex items-center gap-4 my-6">
              <div className="bg-purple-900/60 border border-purple-500/50 px-4 py-2 rounded-2xl text-white font-bold text-sm">
                ⭐ +50 XP Ganada
              </div>
              <div className="bg-amber-900/60 border border-amber-500/50 px-4 py-2 rounded-2xl text-amber-300 font-bold text-sm">
                💎 +25 Monedas
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startCamera}
                className="py-3 px-6 rounded-2xl bg-white text-purple-900 font-extrabold text-sm hover:bg-purple-50 transition-colors"
              >
                Repetir Actividad
              </button>
              <button
                onClick={() => navigate('home')}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-extrabold text-sm hover:opacity-95 transition-opacity"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Start Button & Instructions */}
      {!isMirrorActive && !isCompleted && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={startCamera}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white font-black text-base shadow-xl shadow-purple-500/30 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Camera className="w-5 h-5" />
            <span>Encender Espejo (30 Segundos)</span>
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Si no tienes cámara disponible o prefieres no usarla, el sistema activará automáticamente el espejo virtual interactivo.
          </p>
        </div>
      )}
    </div>
  );
};

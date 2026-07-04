import React, { useState } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Settings, Moon, Sun, Volume2, VolumeX, ShieldCheck, LogOut, ArrowLeft, Heart, Smartphone, HelpCircle, Download } from 'lucide-react';
import { sound } from '../../services/soundService';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, user, logout, navigate, triggerToast } = useGlow();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privateMirror, setPrivateMirror] = useState(true);

  if (!user) return null;

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      sound.playCoinWin();
      triggerToast('Sonido Activado 🔊', 'Efectos de audio interactivos en juegos y espejo.', 'system');
    } else {
      triggerToast('Silencio Activado 🔇', 'Has desactivado los efectos sonoros.', 'system');
    }
  };

  const handleExportData = () => {
    sound.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `glowme_perfil_${user.name.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Datos Exportados 📦', 'Se ha descargado un respaldo de tu perfil en tu dispositivo.', 'system');
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

        <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
          <Settings className="w-4 h-4" />
          <span>Configuración & Preferencias</span>
        </span>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Tu Espacio, Tus Reglas ⚙️✨</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mt-1">
            Personaliza el tema visual, la privacidad del espejo inteligente y los efectos de sonido de GlowMe.
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
          🛠️
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-6">
        <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider">
          Apariencia & Sonido
        </h3>

        {/* Theme */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Modo Oscuro / Claro</h4>
              <p className="text-xs text-slate-500 font-medium">Adapta los colores lilas y morados a la iluminación de tu entorno.</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-2xl bg-purple-600 text-white font-extrabold text-xs shadow-sm hover:bg-purple-700 transition-all"
          >
            {theme === 'dark' ? '☀️ Luz Día' : '🌙 Noche Violeta'}
          </button>
        </div>

        {/* Audio */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Efectos de Audio Gamer</h4>
              <p className="text-xs text-slate-500 font-medium">Sonidos y acordes de felicitación al ganar XP o superar retos.</p>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all ${
              soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {soundEnabled ? 'Activado 🔊' : 'Silenciado 🔇'}
          </button>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/40 shadow-sm space-y-6">
        <h3 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Privacidad & Datos Seguros</span>
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Privacidad Absoluta en Espejo</h4>
            <p className="text-xs text-slate-500 font-medium">Ninguna imagen de tu cámara se guarda, graba ni transmite a servidores.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
            🔒 100% Blindado
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Respaldo de Mi Diario y Perfil</h4>
            <p className="text-xs text-slate-500 font-medium">Descarga tus notas y reflexiones emocionales en formato seguro JSON.</p>
          </div>
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-1.5 hover:bg-indigo-700"
          >
            <Download className="w-3.5 h-3.5" /> Descargar
          </button>
        </div>
      </div>

      {/* About App */}
      <div className="bg-purple-50 dark:bg-purple-950/30 p-5 rounded-3xl border border-purple-100 dark:border-purple-900/40 text-center space-y-2">
        <h4 className="font-extrabold text-sm text-purple-900 dark:text-purple-200">GlowMe v2.0 — Autoestima & IA para Jóvenes</h4>
        <p className="text-xs text-purple-700 dark:text-purple-300 max-w-md mx-auto">
          Diseñado con los colores morado, lila, rosa pastel y blanco siguiendo los estándares de Material Design 3 y Clean Architecture para adolescentes de 13 a 18 años.
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-4 rounded-2xl bg-rose-500 text-white font-black text-sm shadow-md hover:bg-rose-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        <span>Cerrar Sesión Segura</span>
      </button>
    </div>
  );
};

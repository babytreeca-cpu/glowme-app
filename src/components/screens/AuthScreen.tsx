import React, { useState, useEffect } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Mail, Lock, User, Calendar, Smile, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';

export const AuthScreen: React.FC<{ mode?: 'login' | 'register' }> = ({ mode: initialMode = 'login' }) => {
  const { loginWithEmail, registerUser, loginWithGoogle, navigate, triggerToast } = useGlow();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode || 'login');

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(15);
  const [gender, setGender] = useState('Prefiero no decir');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          setErrorMsg('Por favor ingresa tu correo y contraseña.');
          setLoading(false);
          return;
        }
        await loginWithEmail(email, password);
      } else if (mode === 'register') {
        if (!email || !password || !name) {
          setErrorMsg('Por favor completa todos los campos.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
          setLoading(false);
          return;
        }
        await registerUser(email, password, name, age, gender);
      } else if (mode === 'forgot') {
        if (!email) {
          setErrorMsg('Escribe tu correo electrónico para enviar el enlace.');
          setLoading(false);
          return;
        }
        try {
          await sendPasswordResetEmail(auth, email);
          triggerToast('Correo enviado ✉️', 'Revisa tu bandeja para recuperar tu contraseña.', 'system');
        } catch (err) {
          triggerToast('Correo de recuperación ✉️', 'Hemos procesado tu solicitud de recuperación.', 'system');
        }
        setMode('login');
      }
    } catch (err: any) {
      setErrorMsg('Ocurrió un error al procesar tu solicitud. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/40 p-6 sm:p-8 relative overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('welcome')}
            className="p-2 rounded-xl bg-purple-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              G
            </div>
            <span className="font-black text-sm text-slate-800 dark:text-white">GlowMe</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' && '¡Qué alegría verte de nuevo! ✨'}
            {mode === 'register' && 'Crea tu cuenta GlowMe 🌟'}
            {mode === 'forgot' && 'Recuperar Contraseña 🔒'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {mode === 'login' && 'Ingresa tus datos para continuar tu racha y retos.'}
            {mode === 'register' && 'Únete a miles de adolescentes fortaleciendo su autoestima.'}
            {mode === 'forgot' && 'Te enviaremos un enlace seguro a tu correo electrónico.'}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tu Nombre o Apodo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía, Alex, Mateo..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Edad</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <select
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full pl-10 pr-2 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white font-medium"
                    >
                      {[13, 14, 15, 16, 17, 18].map(n => (
                        <option key={n} value={n}>{n} años</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Género</label>
                  <div className="relative">
                    <Smile className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full pl-10 pr-2 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="No binario">No binario</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>Recordar sesión</span>
              </label>

              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Procesando... ✨</span>
            ) : (
              <>
                <span>{mode === 'login' && 'Iniciar Sesión'}</span>
                <span>{mode === 'register' && 'Registrar mi Cuenta'}</span>
                <span>{mode === 'forgot' && 'Enviar Correo de Recuperación'}</span>
              </>
            )}
          </button>
        </form>

        {mode !== 'forgot' && (
          <>
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[11px] font-bold text-slate-400 uppercase">O continúa con</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.3 8.9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.2L1.6 15.9C3.5 19.7 7.4 23 12 23z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>
          </>
        )}

        {/* Footer switcher */}
        <div className="mt-6 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
          {mode === 'login' && (
            <span>
              ¿Aún no tienes cuenta?{' '}
              <button onClick={() => { setMode('register'); navigate('register'); }} className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                Regístrate aquí
              </button>
            </span>
          )}
          {mode === 'register' && (
            <span>
              ¿Ya tienes una cuenta?{' '}
              <button onClick={() => { setMode('login'); navigate('login'); }} className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                Inicia sesión aquí
              </button>
            </span>
          )}
          {mode === 'forgot' && (
            <button onClick={() => { setMode('login'); navigate('login'); }} className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
              Volver al Inicio de Sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

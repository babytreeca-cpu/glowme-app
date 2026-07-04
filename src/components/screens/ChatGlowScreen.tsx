import React, { useState, useEffect, useRef } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Bot, Send, Sparkles, ArrowLeft, ShieldAlert, Heart, RefreshCw, User } from 'lucide-react';
import { sendChatMessage } from '../../services/aiService';
import { getChatHistory, saveChatHistory } from '../../services/firebase';
import { ChatMessage } from '../../types';

export const ChatGlowScreen: React.FC = () => {
  const { user, navigate, triggerToast } = useGlow();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    "✨ ¿Cómo puedo mejorar mi autoestima?",
    "🌧️ Siento ansiedad por un examen escolar",
    "🔥 Dame una dosis de motivación",
    "🎯 ¿Cómo me organizo mejor para cumplir mis metas?"
  ];

  useEffect(() => {
    if (user) {
      getChatHistory(user.uid).then(setMessages);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading || !user) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(newHistory, user);
      const glowMsg: ChatMessage = {
        id: `msg_glow_${Date.now()}`,
        sender: 'glow',
        text: reply.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updatedAll = [...newHistory, glowMsg];
      setMessages(updatedAll);
      await saveChatHistory(user.uid, updatedAll);
    } catch (err) {
      triggerToast('Error de conexión ✨', 'No pudimos conectar con Glow. Inténtalo de nuevo.', 'system');
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = async () => {
    if (!user) return;
    const initialMsg: ChatMessage = {
      id: `msg_init_${Date.now()}`,
      sender: 'glow',
      text: `¡Hola de nuevo, ${user.name}! ✨ Estoy aquí con las energías renovadas para escucharte. ¿De qué te gustaría hablar hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMsg]);
    await saveChatHistory(user.uid, [initialMsg]);
    triggerToast('Chat reiniciado 🔄', 'Listo para una nueva conversación.', 'system');
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col h-[82vh] sm:h-[86vh] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <button
          onClick={() => navigate('home')}
          className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Inicio</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm text-slate-800 dark:text-white leading-tight">Chat IA Glow ✨</h2>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Empático • Generativo
            </span>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          title="Reiniciar chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Notice */}
      <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 p-2.5 rounded-2xl text-[11px] text-purple-800 dark:text-purple-200 font-semibold flex items-center gap-2 shrink-0">
        <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
        <span>Glow es tu amigo de inteligencia artificial motivador. No emite diagnósticos médicos o psicológicos.</span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {messages.map((msg) => {
          const isGlow = msg.sender === 'glow';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isGlow ? 'justify-start' : 'justify-end'}`}
            >
              {isGlow && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] sm:max-w-md p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-xs ${
                  isGlow
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-purple-100 dark:border-purple-900/40 rounded-tl-none'
                    : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-tr-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`block text-[9px] mt-1 font-bold ${isGlow ? 'text-slate-400' : 'text-purple-200 text-right'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {!isGlow && (
                <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shrink-0 animate-bounce">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-purple-100 dark:border-purple-900/40 text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Glow está pensando una respuesta cariñosa...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex gap-1.5 overflow-x-auto py-1 shrink-0 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold whitespace-nowrap hover:bg-purple-100 transition-colors shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex items-center gap-2 shrink-0 pt-1"
      >
        <input
          type="text"
          placeholder="Escribe un mensaje a Glow..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

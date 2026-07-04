// Frontend wrapper for AI endpoints (Gemini API via server proxy)
import { Challenge } from '../types';

export async function sendChatMessage(messages: { sender: string; text: string }[], userProfile: any): Promise<{ response: string; timestamp: string }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userProfile })
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching chat from AI proxy:', err);
    return {
      response: "¡Hola! Estoy en modo sin conexión en este momento, pero te mando un abrazo cibernético lleno de buena energía ✨💜. ¿Qué te gustaría lograr hoy en GlowMe?",
      timestamp: new Date().toISOString()
    };
  }
}

export async function analyzeJournalEntry(text: string, moodEmoji: string, userName: string): Promise<{
  detectedEmotion: string;
  summary: string;
  recommendation: string;
  xpAwarded: number;
}> {
  try {
    const res = await fetch('/api/analyze-journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, moodEmoji, userName })
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Error analyzing journal:', err);
    return {
      detectedEmotion: "Reflexiones Sinceras 🌟",
      summary: "Escribir tus sentimientos es un acto maravilloso de valentía y autoconocimiento. Reconocer lo que sientes te hace más fuerte.",
      recommendation: "Tómate 2 minutos para escuchar música relajante o usar el Modo Espejo Inteligente.",
      xpAwarded: 25
    };
  }
}

export async function fetchDailyQuote(): Promise<{ quote: string; author: string; category: string }> {
  try {
    const res = await fetch('/api/daily-quote');
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return {
      quote: "Tu magia es real, tu voz importa y cada paso que das te acerca a tus sueños. ¡Brilla con fuerza!",
      author: "GlowMe ✨",
      category: "Autoestima"
    };
  }
}

export async function fetchGeneratedChallenges(mood: string, age: number): Promise<Challenge[]> {
  try {
    const res = await fetch('/api/generate-challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, age })
    });
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    return data.challenges || [];
  } catch (err) {
    return [
      { id: 'c1', title: 'Sonrisa de Campeón', description: 'Mírate con cariño en el espejo y agradece por todo lo que eres capaz de lograr.', xp: 30, coins: 15, category: 'Autoestima', icon: 'Smile', completed: false },
      { id: 'c2', title: 'Respiración de Paz', description: 'Inhala profundamente durante 4 segundos y exhala en 6 segundos para liberar el estrés.', xp: 25, coins: 10, category: 'Calma', icon: 'Wind', completed: false },
      { id: 'c3', title: 'Palabras de Luz', description: 'Escribe en tu diario emocional o manda un mensaje bonito a un amigo cercano.', xp: 35, coins: 20, category: 'Social', icon: 'Heart', completed: false }
    ];
  }
}

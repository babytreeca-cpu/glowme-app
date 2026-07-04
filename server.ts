import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get GoogleGenAI client lazily
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY not configured. Using fallback simulated AI responses.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// 1. Chatbot Glow Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    const client = getGenAIClient();

    if (!client) {
      // Fallback response when API key is not set
      const lastMsg = messages?.[messages.length - 1]?.text?.toLowerCase() || '';
      let reply = "¡Hola! Estoy aquí para escucharte y ayudarte a descubrir toda la magia que llevas dentro. 🌟 ¿Qué te gustaría compartir hoy?";
      if (lastMsg.includes('triste') || lastMsg.includes('ansie') || lastMsg.includes('mal')) {
        reply = "Siento mucho que te sientas así. Recuerda que es normal tener días difíciles, como las nubes en el cielo. Respira profundo y recuerda que eres más fuerte de lo que imaginas. 💜 ¿Quieres hacer un ejercicio de respiración o un reto de gratitud?";
      } else if (lastMsg.includes('hola') || lastMsg.includes('buen')) {
        reply = "¡Hola superestrella! 🌟 ¡Qué alegría saludarte! ¿Cómo te sientes el día de hoy y qué meta te gustaría alcanzar en GlowMe?";
      } else if (lastMsg.includes('reto') || lastMsg.includes('motiv')) {
        reply = "¡Esa actitud me encanta! 🔥 Te recomiendo el reto de hoy: Mírate en el espejo durante 30 segundos en nuestro Modo Espejo Inteligente y di tres cosas que admiras de ti. ¡Tú puedes!";
      }
      return res.json({ response: reply, timestamp: new Date().toISOString() });
    }

    const systemInstruction = `Eres Glow, un chatbot amigo, empático, juvenil y motivador dentro de la aplicación móvil GlowMe, dirigida a adolescentes de 13 a 18 años.
Tu misión es fortalecer la autoestima, brindar apoyo emocional, motivar el crecimiento personal, aconsejar sobre organización y manejo del estrés o ansiedad, siempre con un tono cercano, cálido, positivo y respetuoso.
REGLAS ESTRICTAS:
1. NUNCA emitas diagnósticos médicos, psicológicos o psiquiátricos, ni recetes tratamientos. Si notas crisis graves, recomienda con cariño hablar con un adulto de confianza o un profesional.
2. Usa lenguaje juvenil, moderno y esperanzador (puedes usar emojis como ✨, 💜, 🌟, 💪, 🚀).
3. Sé breve y directo, no escribas biblias aburridas.
4. Conecta tus respuestas con las funciones de GlowMe (ej. Diario Emocional, Retos Diarios, Modo Espejo Inteligente, Música relajante, Jardín del Crecimiento).
El perfil del usuario es: Nombre ${userProfile?.name || 'Amigo/a'}, Edad: ${userProfile?.age || 'Teens'}, Nivel actual: ${userProfile?.level || 1}.`;

    const formattedHistory = (messages || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 350,
      }
    });

    const replyText = response.text || "¡Estoy aquí para apoyarte en cada paso! 💜 ¿En qué te puedo ayudar hoy?";
    res.json({ response: replyText, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.json({ 
      response: "¡Hola! He tenido un pequeño parpadeo cuántico ✨ pero estoy aquí contigo. Recuerda que eres increíble. ¿Cómo te sientes hoy?", 
      timestamp: new Date().toISOString() 
    });
  }
});

// 2. Journal Emotional Analysis
app.post('/api/analyze-journal', async (req, res) => {
  try {
    const { text, moodEmoji, userName } = req.body;
    const client = getGenAIClient();

    if (!client) {
      // Fallback reflection
      return res.json({
        detectedEmotion: "Reflexivo / Valiente 🌟",
        summary: "Has dado un gran paso al expresar lo que sientes en tu diario. Reconocer tus emociones es una señal de gran inteligencia emocional.",
        recommendation: "Tómate 3 minutos para escuchar la lista de música 'Quiero relajarme' o completa el reto de respiración consciente.",
        xpAwarded: 25
      });
    }

    const prompt = `Analiza la siguiente entrada de diario emocional de un adolescente llamado ${userName || 'Usuario'}.
Emoji de ánimo seleccionado: ${moodEmoji || '📝'}
Texto del diario: "${text}"

Devuelve EXCLUSIVAMENTE un objeto JSON válido (sin código markdown adicional alrededor si es posible, o que sea parseable) con la siguiente estructura exacta:
{
  "detectedEmotion": "Nombre corto de la emoción principal y un emoji (ej: Gratitud y Paz 🕊️, Ansiedad Leve 🌧️, Alegría Radiante ✨)",
  "summary": "Breve mensaje empático y de apoyo de 2 frases reconociendo sus sentimientos y fortaleciendo su autoestima.",
  "recommendation": "Una recomendación práctica y rápida de 1 frase dentro de la app (ej: escuchar música relajante, usar el Modo Espejo Inteligente, hacer un reto o respirar 2 min).",
  "xpAwarded": 30
}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5
      }
    });

    let resultJson;
    try {
      resultJson = JSON.parse(response.text || '{}');
    } catch (e) {
      resultJson = {
        detectedEmotion: "Expresión Sincera ✨",
        summary: "¡Gracias por abrir tu corazón hoy! Cada palabra escrita es un paso hacia un mayor conocimiento de ti mismo.",
        recommendation: "Te recomendamos visitar el Jardín del Crecimiento para ver cómo tus retos te ayudan a florecer.",
        xpAwarded: 25
      };
    }
    res.json(resultJson);
  } catch (error: any) {
    console.error('Error in /api/analyze-journal:', error);
    res.json({
      detectedEmotion: "Consciencia Emocional 💜",
      summary: "Escribir tus pensamientos es una forma maravillosa de cuidar tu mente y corazón. Eres muy valiente.",
      recommendation: "Prueba el Modo Espejo Inteligente para recordar lo especial que eres.",
      xpAwarded: 25
    });
  }
});

// 3. Daily Positive Quote
app.get('/api/daily-quote', async (req, res) => {
  try {
    const client = getGenAIClient();
    if (!client) {
      return res.json({
        quote: "No necesitas ser perfecto para ser maravilloso. Tu brillo es único.",
        author: "GlowMe Wisdom ✨",
        category: "Autoestima"
      });
    }

    const prompt = `Genera una frase motivadora, juvenil, moderna y original sobre autoestima, resiliencia o crecimiento para adolescentes. Devuelve SOLO un JSON:
{
  "quote": "La frase motivadora entre 12 y 20 palabras",
  "author": "Autor inspirador o 'GlowMe'",
  "category": "Una palabra (ej: Autoestima, Valentía, Paz, Fuerza)"
}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error) {
    res.json({
      quote: "Cada día es un lienzo en blanco donde puedes pintar tu mejor versión.",
      author: "GlowMe ✨",
      category: "Motivación"
    });
  }
});

// 4. Generate Custom Challenges
app.post('/api/generate-challenges', async (req, res) => {
  try {
    const { mood, age } = req.body;
    const client = getGenAIClient();
    if (!client) {
      return res.json({
        challenges: [
          { id: 'c1', title: 'Sonrisa de Campeón', description: 'Sonríe frente al espejo durante 30 segundos y agradece por tu día.', xp: 30, coins: 15, category: 'Autoestima', icon: 'Smile' },
          { id: 'c2', title: 'Pausa de Respiración', description: 'Respira profunda y conscientemente durante 2 minutos inhalando paz.', xp: 25, coins: 10, category: 'Calma', icon: 'Wind' },
          { id: 'c3', title: 'Cumplido Sincero', description: 'Dile algo positivo o un cumplido honesto a alguien importante para ti.', xp: 35, coins: 20, category: 'Social', icon: 'Heart' }
        ]
      });
    }

    const prompt = `Genera 3 retos diarios gamificados de autoestima y bienestar para un adolescente de ${age || 15} años con estado de ánimo "${mood || 'normal'}".
Devuelve EXCLUSIVAMENTE un JSON con formato:
{
  "challenges": [
    {
      "id": "gen_1",
      "title": "Título corto y atractivo",
      "description": "Explicación clara en 1 frase de lo que debe hacer hoy",
      "xp": 30,
      "coins": 15,
      "category": "Autoestima / Calma / Social / Gratitud",
      "icon": "Smile o Wind o Heart o Star o Sun"
    }
  ]
}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const data = JSON.parse(response.text || '{"challenges":[]}');
    res.json(data);
  } catch (error) {
    res.json({
      challenges: [
        { id: 'c1', title: 'Sonrisa en el Espejo', description: 'Mírate con cariño y repite tres cualidades positivas sobre ti.', xp: 30, coins: 15, category: 'Autoestima', icon: 'Smile' },
        { id: 'c2', title: 'Tres Fortalezas', description: 'Escribe en tu diario 3 cosas que hiciste muy bien esta semana.', xp: 25, coins: 10, category: 'Gratitud', icon: 'Star' },
        { id: 'c3', title: 'Desconexión Relax', description: 'Escucha 3 minutos de música relajante en GlowMe con los ojos cerrados.', xp: 35, coins: 20, category: 'Calma', icon: 'Sun' }
      ]
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'GlowMe Backend Service', time: new Date().toISOString() });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌟 GlowMe Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

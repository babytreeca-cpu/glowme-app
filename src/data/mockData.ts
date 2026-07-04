import { Achievement, MusicTrack, AvatarItem, PlantStage, Quote } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_1', title: 'Primer Paso ✨', description: 'Únete a la comunidad GlowMe y comienza tu viaje.', category: 'General', icon: 'Sparkles', unlocked: true, progress: 1, maxProgress: 1, xpReward: 20, coinReward: 10 },
  { id: 'ach_2', title: 'Racha de 7 Días 🔥', description: 'Entra a GlowMe 7 días seguidos.', category: 'Constancia', icon: 'Flame', unlocked: false, progress: 1, maxProgress: 7, xpReward: 100, coinReward: 50 },
  { id: 'ach_3', title: 'Racha de 30 Días 🚀', description: 'Demuestra tu compromiso imparable durante 30 días.', category: 'Constancia', icon: 'Rocket', unlocked: false, progress: 1, maxProgress: 30, xpReward: 300, coinReward: 200 },
  { id: 'ach_4', title: 'Maestro de Retos 🎯', description: 'Completa tu primer reto diario en GlowMe.', category: 'Retos', icon: 'CheckCircle', unlocked: false, progress: 0, maxProgress: 1, xpReward: 30, coinReward: 15 },
  { id: 'ach_5', title: '10 Retos Superados 🏆', description: 'Supera 10 retos de amor propio.', category: 'Retos', icon: 'Award', unlocked: false, progress: 0, maxProgress: 10, xpReward: 150, coinReward: 80 },
  { id: 'ach_6', title: 'Escritor Valiente 📖', description: 'Escribe tu primera entrada en el Diario Emocional.', category: 'Diario', icon: 'BookOpen', unlocked: false, progress: 0, maxProgress: 1, xpReward: 40, coinReward: 20 },
  { id: 'ach_7', title: '10 Entradas de Diario ✍️', description: 'Expresa y analiza 10 estados emocionales con IA.', category: 'Diario', icon: 'Feather', unlocked: false, progress: 0, maxProgress: 10, xpReward: 120, coinReward: 60 },
  { id: 'ach_8', title: 'Jugador Brillante 🎮', description: 'Juega 5 partidas en nuestra zona arcade de bienestar.', category: 'Juegos', icon: 'Gamepad2', unlocked: false, progress: 0, maxProgress: 5, xpReward: 50, coinReward: 25 },
  { id: 'ach_9', title: 'Espejo Mágico 🪞', description: 'Utiliza el Modo Espejo Inteligente durante 30 segundos.', category: 'Espejo', icon: 'Sparkle', unlocked: false, progress: 0, maxProgress: 1, xpReward: 80, coinReward: 40 },
  { id: 'ach_10', title: 'Amigo de Glow 🤖', description: 'Chatea con nuestra IA Glow sobre tu crecimiento.', category: 'Social', icon: 'Bot', unlocked: false, progress: 0, maxProgress: 1, xpReward: 35, coinReward: 15 },
  { id: 'ach_11', title: 'Jardín en Flor 🌸', description: 'Haz evolucionar tu jardín de crecimiento a la fase Flor.', category: 'General', icon: 'Flower2', unlocked: false, progress: 0, maxProgress: 1, xpReward: 100, coinReward: 50 },
  { id: 'ach_12', title: 'Amante de la Música 🎧', description: 'Relájate escuchando 3 pistas musicales en GlowMe.', category: 'General', icon: 'Headphones', unlocked: false, progress: 0, maxProgress: 3, xpReward: 45, coinReward: 20 }
];

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'm1', title: 'Olas de Calma & Lofi', artist: 'GlowMe Ambient', category: 'Quiero relajarme', duration: '3:45', coverGradient: 'from-purple-500 to-indigo-600', description: 'Sintetizador binaural relajante con ondas suaves.', frequency: 432, bpm: 70 },
  { id: 'm2', title: 'Energía Solar y Motivación', artist: 'GlowMe Beats', category: 'Necesito motivación', duration: '2:50', coverGradient: 'from-pink-500 to-rose-500', description: 'Ritmo pop alegre para empezar el día con todo.', frequency: 528, bpm: 120 },
  { id: 'm3', title: 'Brisa de Paz Interior', artist: 'Serenity AI', category: 'Tengo ansiedad', duration: '4:15', coverGradient: 'from-violet-400 to-purple-700', description: 'Frecuencia 396Hz para disolver tensiones y respirar profundo.', frequency: 396, bpm: 60 },
  { id: 'm4', title: 'Alegría Radiante', artist: 'Sunshine Pop', category: 'Estoy feliz', duration: '3:10', coverGradient: 'from-amber-400 to-pink-500', description: 'Melodía chispeante para celebrar tu felicidad.', frequency: 639, bpm: 115 },
  { id: 'm5', title: 'Sueños en Púrpura', artist: 'GlowMe Sleep', category: 'Quiero relajarme', duration: '5:00', coverGradient: 'from-indigo-900 to-purple-800', description: 'Acordes lentos y profundos para calmar la mente en la noche.', frequency: 432, bpm: 55 }
];

export const AVATAR_ITEMS: AvatarItem[] = [
  { id: 'out_casual', name: 'Sudadera Violeta Glow', type: 'outfit', price: 0, icon: 'Shirt', color: '#8B5CF6', unlocked: true, requiredLevel: 1 },
  { id: 'out_star', name: 'Chaqueta Estelar Rosa', type: 'outfit', price: 50, icon: 'Shirt', color: '#F472B6', unlocked: false, requiredLevel: 2 },
  { id: 'out_gold', name: 'Sudadera de Campeón', type: 'outfit', price: 120, icon: 'Shirt', color: '#F59E0B', unlocked: false, requiredLevel: 5 },
  { id: 'hair_waves', name: 'Ondas Libres', type: 'hairStyle', price: 0, icon: 'Scissors', color: '#6D28D9', unlocked: true, requiredLevel: 1 },
  { id: 'hair_short', name: 'Estilo Moderno Corto', type: 'hairStyle', price: 40, icon: 'Scissors', color: '#1E1B4B', unlocked: false, requiredLevel: 2 },
  { id: 'hair_pony', name: 'Coleta Alta Juvenil', type: 'hairStyle', price: 60, icon: 'Scissors', color: '#DB2777', unlocked: false, requiredLevel: 3 },
  { id: 'acc_none', name: 'Sin Accesorio', type: 'accessory', price: 0, icon: 'Sparkles', unlocked: true, requiredLevel: 1 },
  { id: 'acc_glasses', name: 'Gafas de Sol Cool 😎', type: 'accessory', price: 45, icon: 'Glasses', unlocked: false, requiredLevel: 2 },
  { id: 'acc_crown', name: 'Corona de Autoestima 👑', type: 'accessory', price: 150, icon: 'Crown', unlocked: false, requiredLevel: 5 },
  { id: 'acc_headphones', name: 'Audífonos Lofi 🎧', type: 'accessory', price: 80, icon: 'Headphones', unlocked: false, requiredLevel: 3 },
  { id: 'bg_stars', name: 'Universo Púrpura ✨', type: 'background', price: 0, icon: 'Image', color: 'from-purple-900 to-indigo-900', unlocked: true, requiredLevel: 1 },
  { id: 'bg_sunset', name: 'Atardecer Pastel 🌅', type: 'background', price: 70, icon: 'Image', color: 'from-pink-400 via-purple-400 to-indigo-500', unlocked: false, requiredLevel: 3 },
  { id: 'bg_garden', name: 'Jardín Esmeralda 🌿', type: 'background', price: 100, icon: 'Image', color: 'from-emerald-700 to-teal-900', unlocked: false, requiredLevel: 4 }
];

export const PLANT_STAGES: PlantStage[] = [
  { id: 'p1', name: 'Semilla Mágica', stage: 1, description: 'Una pequeña semilla llena de potencial ilimitado esperando brotar.', icon: '🌱', unlocked: true, requiredXp: 0 },
  { id: 'p2', name: 'Brote de Luz', stage: 2, description: 'Tus primeros retos han hecho brotar pequeñas hojas llenas de esperanza.', icon: '🌿', unlocked: true, requiredXp: 50 },
  { id: 'p3', name: 'Flor de Cristal', stage: 3, description: 'Una hermosa flor violeta se ha abierto. Tu confianza está floreciendo.', icon: '🌸', unlocked: false, requiredXp: 150 },
  { id: 'p4', name: 'Árbol de la Sabiduría', stage: 4, description: 'Un árbol fuerte y frondoso que representa tu resiliencia y fortaleza mental.', icon: '🌳', unlocked: false, requiredXp: 350 },
  { id: 'p5', name: 'Oasis con Mariposas', stage: 5, description: '¡El jardín completo está en armonía! Mariposas mágicas rodean tus logros.', icon: '🦋✨', unlocked: false, requiredXp: 600 }
];

export const INITIAL_QUOTES: Quote[] = [
  { id: 'q1', text: 'No necesitas ser perfecto para ser maravilloso. Tu brillo es único.', author: 'GlowMe Wisdom ✨', category: 'Autoestima', isFavorite: true, bgGradient: 'from-purple-600 to-indigo-700' },
  { id: 'q2', text: 'Respira profundo: hoy es una nueva oportunidad para amarte y crecer.', author: 'Serenity 🌸', category: 'Paz', isFavorite: false, bgGradient: 'from-pink-500 to-purple-600' },
  { id: 'q3', text: 'Habla contigo mismo como hablarías con alguien a quien amas profundamente.', author: 'Brené Brown', category: 'Autoestima', isFavorite: false, bgGradient: 'from-violet-600 to-fuchsia-700' },
  { id: 'q4', text: 'Eres mucho más fuerte que tus dudas y más grande que tus miedos.', author: 'GlowMe Motivation 🔥', category: 'Valentía', isFavorite: true, bgGradient: 'from-rose-500 to-purple-700' },
  { id: 'q5', text: 'El amor propio no es un destino, es una práctica diaria llena de compasión.', author: 'Glow ✨', category: 'Amor propio', isFavorite: false, bgGradient: 'from-indigo-600 to-pink-600' }
];

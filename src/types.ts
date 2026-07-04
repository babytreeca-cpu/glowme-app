export type ScreenType = 
  | 'splash'
  | 'welcome'
  | 'auth'
  | 'login'
  | 'register'
  | 'home'
  | 'profile'
  | 'challenges'
  | 'journal'
  | 'music'
  | 'games'
  | 'quotes'
  | 'chat'
  | 'garden'
  | 'avatar'
  | 'achievements'
  | 'statistics'
  | 'notifications'
  | 'settings'
  | 'mirror';

export type MoodType = 'feliz' | 'relajado' | 'normal' | 'ansioso' | 'triste' | 'motivado' | 'cansado';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  photoUrl?: string;
  avatarConfig: {
    skinColor: string;
    hairStyle: string;
    hairColor: string;
    outfit: string;
    accessory: string;
    background: string;
  };
  level: number;
  xp: number;
  xpNextLevel: number;
  coins: number;
  streakDays: number;
  lastLoginDate: string;
  currentMood: MoodType;
  goals: string[];
  interests: string[];
  musicPreferences: string[];
  isGuest?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  coins: number;
  category: 'Autoestima' | 'Calma' | 'Social' | 'Gratitud' | 'Espejo';
  icon: string;
  completed: boolean;
  completedAt?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  moodEmoji: string;
  moodName: string;
  text: string;
  aiAnalysis?: {
    detectedEmotion: string;
    summary: string;
    recommendation: string;
    xpAwarded: number;
  };
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  category: 'Necesito motivación' | 'Estoy feliz' | 'Tengo ansiedad' | 'Quiero relajarme';
  duration: string;
  coverGradient: string;
  description: string;
  frequency: number; // Web Audio synth base frequency for ambient generation
  bpm: number;
}

export interface GameRecord {
  gameId: 'memory' | 'puzzle' | 'concentration' | 'reflexes';
  gameName: string;
  highScore: number;
  gamesPlayed: number;
  lastPlayed: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  isFavorite?: boolean;
  bgGradient?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'glow';
  text: string;
  timestamp: string;
}

export interface PlantStage {
  id: string;
  name: string;
  stage: number; // 1 to 5
  description: string;
  icon: string;
  unlocked: boolean;
  requiredXp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'Retos' | 'Diario' | 'Juegos' | 'Espejo' | 'Constancia' | 'Social' | 'General';
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  xpReward: number;
  coinReward: number;
  unlockedAt?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'challenge' | 'mood' | 'journal' | 'breathe' | 'system';
  read: boolean;
  actionScreen?: ScreenType;
}

export interface AvatarItem {
  id: string;
  name: string;
  type: 'outfit' | 'hairStyle' | 'accessory' | 'background';
  price: number;
  icon: string;
  color?: string;
  unlocked: boolean;
  requiredLevel: number;
}

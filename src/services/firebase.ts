import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { UserProfile, JournalEntry, Challenge, GameRecord, Quote, Achievement, ChatMessage } from '../types';

const firebaseConfig = {
  projectId: "gen-lang-client-0028048486",
  appId: "1:154346462322:web:d2de4560e804425e58b6eb",
  apiKey: "AIzaSyCDf9W-TJzg9OhAeJkFMH1rv8hDW0Ad28s",
  authDomain: "gen-lang-client-0028048486.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-glowme-aabf84f8-712c-4b83-b153-c5516a768c7d",
  storageBucket: "gen-lang-client-0028048486.firebasestorage.app",
  messagingSenderId: "154346462322",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => console.log('Persistence error:', err));

export const db = getFirestore(app, "ai-studio-glowme-aabf84f8-712c-4b83-b153-c5516a768c7d");

// Helper: default user profile
export function createDefaultProfile(uid: string, email: string, name: string, age: number = 15, gender: string = 'Prefiero no decir', isGuest: boolean = false): UserProfile {
  return {
    uid,
    email,
    name: name || 'Glower ✨',
    age,
    gender,
    photoUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    avatarConfig: {
      skinColor: '#FAD2B1',
      hairStyle: 'waves',
      hairColor: '#6D28D9',
      outfit: 'casual_purple',
      accessory: 'none',
      background: 'bg_stars'
    },
    level: 1,
    xp: 0,
    xpNextLevel: 100,
    coins: 50,
    streakDays: 1,
    lastLoginDate: new Date().toISOString().split('T')[0],
    currentMood: 'feliz',
    goals: ['Mejorar mi confianza', 'Reducir la ansiedad escolar', 'Pensar más en positivo'],
    interests: ['Música relajante', 'Juegos mentales', 'Afirmaciones diarias'],
    musicPreferences: ['Pop motivador', 'Lofi relax', 'Acústico sereno'],
    isGuest
  };
}

// User profile operations
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  } catch (error) {
    console.warn('Error fetching profile from Firestore, checking localStorage:', error);
  }
  const local = localStorage.getItem(`glowme_user_${uid}`);
  return local ? JSON.parse(local) : null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    localStorage.setItem(`glowme_user_${profile.uid}`, JSON.stringify(profile));
    if (!profile.isGuest) {
      await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
    }
  } catch (error) {
    console.warn('Saved profile locally (Firestore offline/permission):', error);
  }
}

// Journal operations
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  try {
    const q = query(collection(db, 'journal'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
    entries.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    return entries;
  } catch (error) {
    console.warn('Error loading journal from Firestore:', error);
    const local = localStorage.getItem(`glowme_journal_${userId}`);
    return local ? JSON.parse(local) : [];
  }
}

export async function saveJournalEntry(entry: JournalEntry): Promise<string> {
  try {
    const localStr = localStorage.getItem(`glowme_journal_${entry.userId}`);
    const localList: JournalEntry[] = localStr ? JSON.parse(localStr) : [];
    const id = entry.id || `journal_${Date.now()}`;
    const newEntry = { ...entry, id };
    const updatedList = [newEntry, ...localList.filter(e => e.id !== id)];
    localStorage.setItem(`glowme_journal_${entry.userId}`, JSON.stringify(updatedList));

    if (!entry.userId.startsWith('guest_')) {
      const docRef = await addDoc(collection(db, 'journal'), newEntry);
      return docRef.id;
    }
    return id;
  } catch (error) {
    console.warn('Saved journal entry locally:', error);
    return entry.id || `journal_${Date.now()}`;
  }
}

// Challenges operations
export async function getSavedChallenges(userId: string, dateStr: string): Promise<Challenge[]> {
  const local = localStorage.getItem(`glowme_challenges_${userId}_${dateStr}`);
  if (local) return JSON.parse(local);
  return [];
}

export async function saveChallenges(userId: string, dateStr: string, challenges: Challenge[]): Promise<void> {
  localStorage.setItem(`glowme_challenges_${userId}_${dateStr}`, JSON.stringify(challenges));
}

// Chat history
export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  const local = localStorage.getItem(`glowme_chat_${userId}`);
  if (local) return JSON.parse(local);
  return [
    {
      id: 'msg_init_1',
      sender: 'glow',
      text: '¡Hola! Soy Glow ✨, tu amigo e IA de confianza en GlowMe. ¿Cómo te sientes hoy? Estoy aquí para motivarte y escucharte.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
}

export async function saveChatHistory(userId: string, messages: ChatMessage[]): Promise<void> {
  localStorage.setItem(`glowme_chat_${userId}`, JSON.stringify(messages));
}

// Games High Scores
export async function getGameRecords(userId: string): Promise<Record<string, GameRecord>> {
  const local = localStorage.getItem(`glowme_games_${userId}`);
  if (local) return JSON.parse(local);
  return {
    memory: { gameId: 'memory', gameName: 'Memoria Brillante', highScore: 0, gamesPlayed: 0, lastPlayed: '' },
    puzzle: { gameId: 'puzzle', gameName: 'Rompecabezas Positivo', highScore: 0, gamesPlayed: 0, lastPlayed: '' },
    concentration: { gameId: 'concentration', gameName: 'Ojo de Águila', highScore: 0, gamesPlayed: 0, lastPlayed: '' },
    reflexes: { gameId: 'reflexes', gameName: 'Lluvia de Estrellas', highScore: 0, gamesPlayed: 0, lastPlayed: '' }
  };
}

export async function saveGameRecord(userId: string, record: GameRecord): Promise<void> {
  const records = await getGameRecords(userId);
  const existing = records[record.gameId] || { gamesPlayed: 0, highScore: 0 };
  records[record.gameId] = {
    ...record,
    highScore: Math.max(existing.highScore, record.highScore),
    gamesPlayed: existing.gamesPlayed + 1,
    lastPlayed: new Date().toISOString()
  };
  localStorage.setItem(`glowme_games_${userId}`, JSON.stringify(records));
}

// Achievements helper
export async function getUnlockedAchievements(userId: string): Promise<string[]> {
  const local = localStorage.getItem(`glowme_achievements_${userId}`);
  return local ? JSON.parse(local) : ['ach_1']; // default achievement for joining
}

export async function saveUnlockedAchievements(userId: string, ids: string[]): Promise<void> {
  localStorage.setItem(`glowme_achievements_${userId}`, JSON.stringify(ids));
}

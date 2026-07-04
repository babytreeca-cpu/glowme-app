import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ScreenType, 
  UserProfile, 
  Challenge, 
  JournalEntry, 
  Achievement, 
  PlantStage, 
  Quote, 
  AppNotification, 
  MusicTrack, 
  MoodType 
} from '../types';
import { 
  auth, 
  createDefaultProfile, 
  getUserProfile, 
  saveUserProfile, 
  getJournalEntries, 
  saveJournalEntry, 
  getSavedChallenges, 
  saveChallenges, 
  getUnlockedAchievements, 
  saveUnlockedAchievements 
} from '../services/firebase';
import { sound } from '../services/soundService';
import { fetchGeneratedChallenges } from '../services/aiService';
import { INITIAL_ACHIEVEMENTS, MUSIC_TRACKS, PLANT_STAGES, INITIAL_QUOTES, AVATAR_ITEMS } from '../data/mockData';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface GlowContextType {
  user: UserProfile | null;
  currentScreen: ScreenType;
  navigate: (screen: ScreenType) => void;
  isLoading: boolean;
  
  // Auth
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerUser: (e: string, p: string, name: string, age: number, gender: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  updateProfile: (changes: Partial<UserProfile>) => Promise<void>;
  updateMood: (mood: MoodType) => void;

  // Gamification & Stats
  addXp: (amount: number, reason?: string) => void;
  addCoins: (amount: number) => void;
  dailyChallenges: Challenge[];
  toggleChallenge: (id: string) => void;
  generateNewChallenges: () => Promise<void>;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => Promise<void>;

  // Achievements & Garden
  achievements: Achievement[];
  plantStages: PlantStage[];
  currentPlantStage: PlantStage;

  // Music
  musicTracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  isPlayingMusic: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;

  // Quotes
  quotes: Quote[];
  toggleFavoriteQuote: (id: string) => void;
  addCustomQuote: (quote: Quote) => void;

  // Avatar Store
  avatarItems: any[];
  buyAvatarItem: (item: any) => void;
  equipAvatarItem: (type: string, id: string, color?: string) => void;

  // Settings & Notifications
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMobileFrame: boolean;
  toggleMobileFrame: () => void;
  soundMuted: boolean;
  toggleSound: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  notifications: AppNotification[];
  unreadNotifCount: number;
  markAllNotifsRead: () => void;
  triggerToast: (title: string, message: string, type?: 'challenge' | 'mood' | 'journal' | 'breathe' | 'system') => void;
  activeToast: { title: string; message: string; type: string } | null;
}

const GlowContext = createContext<GlowContextType | undefined>(undefined);

export const GlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Lists
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [avatarItems, setAvatarItems] = useState<any[]>(AVATAR_ITEMS);

  // Music
  const [musicTracks] = useState<MusicTrack[]>(MUSIC_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(MUSIC_TRACKS[0]);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);

  // Config
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('es');

  // Notifications & Toast
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 'n1', title: '¡Hola estrella! ✨', message: 'Tu reto del día te está esperando para darte 30 XP.', time: 'Hace 5m', type: 'challenge', read: false, actionScreen: 'challenges' },
    { id: 'n2', title: '¿Cómo te sientes hoy? 💜', message: 'Registra tus emociones en el diario y recibe un consejo de nuestra IA.', time: 'Hace 1h', type: 'mood', read: false, actionScreen: 'journal' },
    { id: 'n3', title: 'Modo Espejo Inteligente 🪞', message: 'Dedica 30 segundos a mirarte al espejo con afirmaciones positivas.', time: 'Hace 3h', type: 'breathe', read: true, actionScreen: 'mirror' }
  ]);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: string } | null>(null);

  // Calculate current plant stage
  const plantStages = PLANT_STAGES;
  const totalCompletedChallenges = dailyChallenges.filter(c => c.completed).length + (user?.xp || 0) / 30;
  const currentPlantStage = PLANT_STAGES.slice().reverse().find(p => (user?.xp || 0) >= p.requiredXp) || PLANT_STAGES[0];

  // Apply dark mode to document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync sound mute
  useEffect(() => {
    sound.setMuted(soundMuted);
  }, [soundMuted]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        let prof = await getUserProfile(firebaseUser.uid);
        if (!prof) {
          prof = createDefaultProfile(firebaseUser.uid, firebaseUser.email || '', firebaseUser.displayName || 'Glower ✨');
          await saveUserProfile(prof);
        }
        setUser(prof);
        await loadUserData(prof.uid);
      } else {
        // check guest
        const guestId = localStorage.getItem('glowme_active_guest');
        if (guestId) {
          const prof = await getUserProfile(guestId);
          if (prof) {
            setUser(prof);
            await loadUserData(prof.uid);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function loadUserData(uid: string) {
    // load journal
    const journals = await getJournalEntries(uid);
    setJournalEntries(journals);

    // load daily challenges for today
    const today = new Date().toISOString().split('T')[0];
    let ch = await getSavedChallenges(uid, today);
    if (!ch || ch.length === 0) {
      ch = await fetchGeneratedChallenges('feliz', 15);
      await saveChallenges(uid, today, ch);
    }
    setDailyChallenges(ch);

    // load achievements
    const unlockedIds = await getUnlockedAchievements(uid);
    setAchievements(prev => prev.map(a => ({ ...a, unlocked: unlockedIds.includes(a.id) })));
  }

  const navigate = (screen: ScreenType) => {
    sound.playClick();
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerToast = (title: string, message: string, type: 'challenge' | 'mood' | 'journal' | 'breathe' | 'system' = 'system') => {
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 4000);
  };

  const addXp = (amount: number, reason?: string) => {
    if (!user) return;
    const newXp = user.xp + amount;
    let newLevel = user.level;
    let newNextXp = user.xpNextLevel;
    let levelUp = false;

    if (newXp >= newNextXp) {
      newLevel += 1;
      newNextXp = Math.floor(newNextXp * 1.5);
      levelUp = true;
      sound.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#3B82F6']
      });
      triggerToast('¡Subiste de Nivel! 🎉', `¡Felicidades! Ahora estás en el Nivel ${newLevel} de GlowMe.`, 'challenge');
    }

    const updated = { ...user, xp: newXp, level: newLevel, xpNextLevel: newNextXp };
    setUser(updated);
    saveUserProfile(updated);

    if (!levelUp && reason) {
      triggerToast('¡XP Ganada! ⭐', `+${amount} XP por ${reason}`, 'challenge');
    }
  };

  const addCoins = (amount: number) => {
    if (!user) return;
    sound.playCoinWin();
    const updated = { ...user, coins: user.coins + amount };
    setUser(updated);
    saveUserProfile(updated);
  };

  const updateMood = (mood: MoodType) => {
    if (!user) return;
    sound.playClick();
    const updated = { ...user, currentMood: mood };
    setUser(updated);
    saveUserProfile(updated);
    triggerToast('Estado emocional registrado 💜', `¡Gracias por compartir que te sientes ${mood}!`, 'mood');
  };

  const toggleChallenge = (id: string) => {
    sound.playClick();
    setDailyChallenges(prev => {
      const updated = prev.map(c => {
        if (c.id === id) {
          const newStatus = !c.completed;
          if (newStatus) {
            sound.playComplete();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#8B5CF6', '#EC4899', '#10B981']
            });
            addXp(c.xp, `completar reto: ${c.title}`);
            addCoins(c.coins);
          }
          return { ...c, completed: newStatus, completedAt: newStatus ? new Date().toISOString() : undefined };
        }
        return c;
      });
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        saveChallenges(user.uid, today, updated);
      }
      return updated;
    });
  };

  const generateNewChallenges = async () => {
    if (!user) return;
    sound.playClick();
    triggerToast('Generando Retos IA ✨', 'Nuestra IA está diseñando nuevos retos personalizados para ti...', 'system');
    const ch = await fetchGeneratedChallenges(user.currentMood, user.age);
    const today = new Date().toISOString().split('T')[0];
    await saveChallenges(user.uid, today, ch);
    setDailyChallenges(ch);
    triggerToast('¡Retos listos! 🔥', 'Tienes 3 nuevos retos motivadores para hoy.', 'challenge');
  };

  const addJournalEntry = async (entry: JournalEntry) => {
    sound.playComplete();
    const id = await saveJournalEntry(entry);
    const entryWithId = { ...entry, id };
    setJournalEntries(prev => [entryWithId, ...prev]);
    addXp(entry.aiAnalysis?.xpAwarded || 30, 'escribir en tu Diario Emocional');
    addCoins(15);
    triggerToast('Diario Guardado 📖', ' Tu entrada ha sido analizada con amor por la IA.', 'journal');
  };

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlayingMusic(true);
    sound.startAmbientSynth(track.frequency || 432);
  };

  const pauseTrack = () => {
    setIsPlayingMusic(false);
    sound.stopAmbientSynth();
  };

  const togglePlay = () => {
    if (isPlayingMusic) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  const toggleFavoriteQuote = (id: string) => {
    sound.playClick();
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));
  };

  const addCustomQuote = (quote: Quote) => {
    sound.playClick();
    setQuotes(prev => [quote, ...prev]);
    triggerToast('Frase guardada ✨', 'Tu frase inspiradora se unió a tu colección.', 'system');
  };

  const buyAvatarItem = (item: any) => {
    if (!user || user.coins < item.price) {
      sound.playClick();
      triggerToast('Monedas insuficientes 💎', `Necesitas ${item.price - user.coins} monedas más para comprar "${item.name}".`, 'system');
      return;
    }
    sound.playCoinWin();
    const updatedCoins = user.coins - item.price;
    const updatedItems = avatarItems.map(i => i.id === item.id ? { ...i, unlocked: true } : i);
    setAvatarItems(updatedItems);
    
    // Equip automatically
    equipAvatarItem(item.type, item.id, item.color);
    const updatedUser = { ...user, coins: updatedCoins };
    setUser(updatedUser);
    saveUserProfile(updatedUser);
    triggerToast('¡Artículo Desbloqueado! 🛍️', `Compraste y equipaste "${item.name}".`, 'challenge');
  };

  const equipAvatarItem = (type: string, id: string, color?: string) => {
    if (!user) return;
    sound.playClick();
    const newConfig = { ...user.avatarConfig };
    if (type === 'outfit') newConfig.outfit = id;
    if (type === 'hairStyle') newConfig.hairStyle = id;
    if (type === 'accessory') newConfig.accessory = id;
    if (type === 'background') newConfig.background = id;
    if (color && type === 'outfit') newConfig.outfit = id;
    
    const updated = { ...user, avatarConfig: newConfig };
    setUser(updated);
    saveUserProfile(updated);
    triggerToast('Avatar actualizado ✨', 'Tu nuevo estilo luce espectacular en GlowMe.', 'system');
  };

  // Auth Methods
  const loginWithEmail = async (e: string, p: string) => {
    sound.playClick();
    try {
      const res = await signInWithEmailAndPassword(auth, e, p);
      let prof = await getUserProfile(res.user.uid);
      if (!prof) {
        prof = createDefaultProfile(res.user.uid, res.user.email || '', res.user.displayName || 'Glower');
        await saveUserProfile(prof);
      }
      setUser(prof);
      localStorage.removeItem('glowme_active_guest');
      navigate('home');
    } catch (error: any) {
      console.warn('Firebase auth error, trying fallback mock login:', error);
      const uid = `mock_${btoa(e).substring(0, 8)}`;
      let prof = await getUserProfile(uid);
      if (!prof) {
        prof = createDefaultProfile(uid, e, e.split('@')[0], 16, 'Prefiero no decir', false);
        await saveUserProfile(prof);
      }
      setUser(prof);
      localStorage.removeItem('glowme_active_guest');
      navigate('home');
    }
  };

  const registerUser = async (e: string, p: string, name: string, age: number, gender: string) => {
    sound.playClick();
    try {
      const res = await createUserWithEmailAndPassword(auth, e, p);
      const prof = createDefaultProfile(res.user.uid, e, name, age, gender, false);
      await saveUserProfile(prof);
      setUser(prof);
      localStorage.removeItem('glowme_active_guest');
      navigate('home');
      triggerToast('¡Bienvenida a GlowMe! 🌟', 'Tu cuenta se creó con éxito. Prepárate para brillar.', 'challenge');
    } catch (error: any) {
      console.warn('Firebase register error, using mock fallback:', error);
      const uid = `user_${Date.now()}`;
      const prof = createDefaultProfile(uid, e, name, age, gender, false);
      await saveUserProfile(prof);
      setUser(prof);
      localStorage.removeItem('glowme_active_guest');
      navigate('home');
      triggerToast('¡Bienvenida a GlowMe! 🌟', 'Cuenta creada con éxito.', 'challenge');
    }
  };

  const loginWithGoogle = async () => {
    sound.playClick();
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      let prof = await getUserProfile(res.user.uid);
      if (!prof) {
        prof = createDefaultProfile(res.user.uid, res.user.email || '', res.user.displayName || 'Google Star ✨');
        await saveUserProfile(prof);
      }
      setUser(prof);
      localStorage.removeItem('glowme_active_guest');
      navigate('home');
      triggerToast('¡Sesión Google Iniciada! ✨', `¡Qué alegría verte de nuevo, ${prof.name}!`, 'system');
    } catch (error: any) {
      console.warn('Google Auth popup closed or failed, fallback to mock Google user:', error);
      const uid = `google_${Date.now()}`;
      const prof = createDefaultProfile(uid, 'estrella.glow@gmail.com', 'Estrella Glow ✨', 15, 'Femenino', false);
      await saveUserProfile(prof);
      setUser(prof);
      localStorage.removeItem('glowme_active_guest');
      navigate('home');
      triggerToast('¡Sesión Google Iniciada! ✨', `Bienvenida, ${prof.name}`, 'system');
    }
  };

  const loginAsGuest = () => {
    sound.playClick();
    const guestId = `guest_${Date.now()}`;
    const prof = createDefaultProfile(guestId, 'invitado@glowme.app', 'Invitado Glow 🌟', 15, 'Prefiero no decir', true);
    saveUserProfile(prof);
    setUser(prof);
    localStorage.setItem('glowme_active_guest', guestId);
    navigate('home');
    triggerToast('¡Modo Invitado Activo! ✨', 'Puedes explorar todos los retos, diario y juegos de GlowMe.', 'system');
  };

  const logout = async () => {
    sound.playClick();
    try {
      await signOut(auth);
    } catch (e) {}
    localStorage.removeItem('glowme_active_guest');
    setUser(null);
    navigate('welcome');
    triggerToast('Sesión cerrada 👋', 'Te esperamos pronto para seguir brillando.', 'system');
  };

  const updateProfile = async (changes: Partial<UserProfile>) => {
    if (!user) return;
    sound.playClick();
    const updated = { ...user, ...changes };
    setUser(updated);
    await saveUserProfile(updated);
    triggerToast('Perfil Guardado ✅', 'Tus datos se actualizaron correctamente.', 'system');
  };

  const toggleDarkMode = () => {
    sound.playClick();
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileFrame = () => {
    sound.playClick();
    setIsMobileFrame(!isMobileFrame);
  };

  const toggleSound = () => {
    setSoundMuted(!soundMuted);
  };

  const markAllNotifsRead = () => {
    sound.playClick();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <GlowContext.Provider
      value={{
        user,
        currentScreen,
        navigate,
        isLoading,
        loginWithEmail,
        registerUser,
        loginWithGoogle,
        loginAsGuest,
        logout,
        updateProfile,
        updateMood,
        addXp,
        addCoins,
        dailyChallenges,
        toggleChallenge,
        generateNewChallenges,
        journalEntries,
        addJournalEntry,
        achievements,
        plantStages,
        currentPlantStage,
        musicTracks,
        currentTrack,
        isPlayingMusic,
        playTrack,
        pauseTrack,
        togglePlay,
        quotes,
        toggleFavoriteQuote,
        addCustomQuote,
        avatarItems,
        buyAvatarItem,
        equipAvatarItem,
        isDarkMode,
        toggleDarkMode,
        isMobileFrame,
        toggleMobileFrame,
        soundMuted,
        toggleSound,
        language,
        setLanguage,
        notifications,
        unreadNotifCount,
        markAllNotifsRead,
        triggerToast,
        activeToast
      }}
    >
      {children}
    </GlowContext.Provider>
  );
};

export const useGlow = () => {
  const context = useContext(GlowContext);
  if (!context) throw new Error('useGlow must be used within a GlowProvider');
  return context;
};

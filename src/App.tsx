import React from 'react';
import { GlowProvider, useGlow } from './context/GlowContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { SideDrawer } from './components/common/SideDrawer';
import { NotificationToast } from './components/common/NotificationToast';
import { MobileFrame } from './components/common/MobileFrame';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { SmartMirrorScreen } from './components/screens/SmartMirrorScreen';
import { ChallengesScreen } from './components/screens/ChallengesScreen';
import { JournalScreen } from './components/screens/JournalScreen';
import { MusicScreen } from './components/screens/MusicScreen';
import { GamesScreen } from './components/screens/GamesScreen';
import { QuotesScreen } from './components/screens/QuotesScreen';
import { ChatGlowScreen } from './components/screens/ChatGlowScreen';
import { GardenScreen } from './components/screens/GardenScreen';
import { AvatarScreen } from './components/screens/AvatarScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { StatisticsScreen } from './components/screens/StatisticsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

const MainRouter: React.FC = () => {
  const { currentScreen, user } = useGlow();

  // If user is not logged in and not on onboarding screens, force welcome/auth/splash
  const isAuthOrSplash = currentScreen === 'splash' || currentScreen === 'welcome' || currentScreen === 'auth' || currentScreen === 'login' || currentScreen === 'register';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'auth':
      case 'login':
        return <AuthScreen mode="login" />;
      case 'register':
        return <AuthScreen mode="register" />;
      case 'home':
        return <HomeScreen />;
      case 'mirror':
        return <SmartMirrorScreen />;
      case 'challenges':
        return <ChallengesScreen />;
      case 'journal':
        return <JournalScreen />;
      case 'music':
        return <MusicScreen />;
      case 'games':
        return <GamesScreen />;
      case 'quotes':
        return <QuotesScreen />;
      case 'chat':
        return <ChatGlowScreen />;
      case 'garden':
        return <GardenScreen />;
      case 'avatar':
      case 'profile':
        return <AvatarScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'statistics':
        return <StatisticsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Top Navigation Header (Only if user is logged in or active in main app) */}
      {!isAuthOrSplash && <Navbar />}

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto ${!isAuthOrSplash ? 'pb-24 sm:pb-8 pt-2' : ''}`}>
        {renderScreen()}
      </main>

      {/* Bottom Navigation for Mobile (MD3 Style) */}
      {!isAuthOrSplash && <BottomNav />}

      {/* Collapsible Side Drawer */}
      <SideDrawer />

      {/* Real-time Floating Alert Toast */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <GlowProvider>
      <MobileFrame>
        <MainRouter />
      </MobileFrame>
    </GlowProvider>
  );
}


import React, { useEffect } from 'react';
import { CreditsProvider } from './context/CreditsContext';
import { useCredits } from './hooks/useCredits';
import { Screen } from './types';
import Home from './screens/Home';
import Store from './screens/Store';
import ManageSubscription from './screens/ManageSubscription';
import History from './screens/History';
import RewardsAd from './screens/RewardsAd';
import CreateContent from './screens/CreateContent';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CreatorPayouts from './screens/CreatorPayouts';
import DeveloperPanel from './screens/DeveloperPanel';
import TimeoutScreen from './components/TimeoutScreen';
import MyCreations from './screens/MyCreations';
import Login from './screens/Login';
import Account from './screens/Account';
import UXKit from './screens/UXKit';
import DesignStudio from './screens/DesignStudio';
import PixPayment from './screens/PixPayment';
import LivePixPayment from './screens/LivePixPayment';
import UserPlanManagement from './screens/UserPlanManagement';
import ShowcaseManagement from './screens/ShowcaseManagement';
import OutfitGenerator from './screens/OutfitGenerator';
import ThemeGenerator from './screens/ThemeGenerator';

const MainLayout: React.FC = () => {
  const { currentScreen, setCurrentScreen, currentUser, isTimedOut, timeoutInfo } = useCredits();

  if (!currentUser) return null; // Should not happen if layout is rendered

  if (isTimedOut(currentUser.id)) {
    return <TimeoutScreen message={timeoutInfo(currentUser.id)!.message} endTime={timeoutInfo(currentUser.id)!.endTime} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
      case 'view-creator':
        return <Home navigate={setCurrentScreen} />;
      case 'store':
        return <Store navigate={setCurrentScreen} />;
      case 'manage-subscription':
        return <ManageSubscription navigate={setCurrentScreen} />;
      case 'history':
        return <History />;
      case 'rewards':
        return <RewardsAd navigate={setCurrentScreen} />;
      case 'create-content':
        return <CreateContent navigate={setCurrentScreen} />;
      case 'my-creations':
        return <MyCreations />;
      case 'creator-payouts':
        return <CreatorPayouts />;
      case 'developer-panel':
        return <DeveloperPanel />;
      case 'user-plan-management':
        return <UserPlanManagement />;
      case 'showcase-management':
        return <ShowcaseManagement />;
      case 'outfit-generator':
        return <OutfitGenerator />;
      case 'theme-generator':
        return <ThemeGenerator />;
      case 'account':
        return <Account />;
       case 'ux-kit':
        return <UXKit />;
      case 'design-studio':
        return <DesignStudio />;
      case 'pix-payment':
        return <PixPayment />;
      case 'livepix-payment':
        return <LivePixPayment />;
      default:
        return <Home navigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentUser && <Navbar navigate={setCurrentScreen} />}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

const AppContent: React.FC = () => {
  const { isLoggedIn, viewingCreatorId, theme } = useCredits();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Allow guest view if a creator profile is being shared/viewed
  if (isLoggedIn || viewingCreatorId) {
    return <MainLayout />;
  }

  return <Login />;
};

const App: React.FC = () => {
  return (
    <CreditsProvider>
      <AppContent />
    </CreditsProvider>
  );
};

export default App;
import React, { useState } from 'react';
import { Screen, UserRole } from '../types';
import { useCredits } from '../hooks/useCredits';
import ProfileHeader from './ProfileHeader';
import GeminiModal from './GeminiModal';

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V7"/><path d="M2 7v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M12 8v4l2 2"></path></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect width="20" height="5" x="2" y="7"></rect><line x1="12" x2="12" y1="22" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>;
const OutfitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const PixIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z"/></svg>;
// Fix: Replaced 'class' with 'className' and kebab-case attributes with camelCase for JSX compatibility.
const LivePixIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const PlusSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const PayoutsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const DevIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const CreationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const AccountIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" /></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const LoginIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const UXKitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 3-3 3 3"/><path d="m9 10 3 3 3-3"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const GeminiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.13 2.69a2 2 0 0 0-1.05.51l-6.85 6.85a2 2 0 0 0 0 2.82l6.85 6.85a2 2 0 0 0 2.82 0l6.85-6.85a2 2 0 0 0 0-2.82l-6.85-6.85a2 2 0 0 0-1.77-.51z"/><path d="m14.28 15.6-3.3-3.3a4.24 4.24 0 0 0 0-6l3.3-3.3"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const DesignStudioIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/><path d="m14 13 2 2 2-2"/><path d="m14 17 2 2 2-2"/></svg>;
// Fix: Replaced kebab-case SVG attributes with camelCase equivalents for JSX compatibility.
const UserPlanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ShowcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const ThemeGeneratorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;


interface NavItemProps {
  screen?: Screen;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (screen?: Screen) => void;
}

const NavItem: React.FC<NavItemProps> = ({ screen, label, icon, isActive, onClick }) => (
  <li className="px-2">
    <button
      onClick={() => onClick(screen)}
      className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-brand-primary text-white shadow-lg'
          : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
      }`}
    >
      <span className="w-6 h-6">{icon}</span>
      <span className="ml-4 font-semibold">{label}</span>
    </button>
  </li>
);

// Fix: Defined a type for navigation items to ensure `screen` is correctly typed as `Screen`.
interface NavConfig {
  screen: Screen;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, userRole, logout, isLoggedIn, shareVitrine } = useCredits();
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [geminiMode, setGeminiMode] = useState<'improve' | 'analyze'>('improve');

  const openGeminiModal = (mode: 'improve' | 'analyze') => {
    setGeminiMode(mode);
    setIsGeminiModalOpen(true);
  };

  const navItems: NavConfig[] = [
    { screen: 'home', label: 'Home', icon: <HomeIcon />, roles: ['user', 'creator', 'developer'] },
    { screen: 'store', label: 'Store', icon: <StoreIcon />, roles: ['user', 'creator', 'developer'] },
    { screen: 'outfit-generator', label: 'Outfit Studio', icon: <OutfitIcon />, roles: ['user', 'creator', 'developer'] },
    { screen: 'theme-generator', label: 'Theme Generator', icon: <ThemeGeneratorIcon />, roles: ['user', 'creator', 'developer'] },
    { screen: 'account', label: 'My Account', icon: <AccountIcon />, roles: ['user', 'creator', 'developer'] },
    { screen: 'manage-subscription', label: 'My Subscription', icon: <StarIcon />, roles: ['user', 'creator'] },
    { screen: 'history', label: 'History', icon: <HistoryIcon />, roles: ['user', 'creator', 'developer'] },
    { screen: 'rewards', label: 'Earn Credits', icon: <GiftIcon />, roles: ['user', 'creator'] },
    { screen: 'pix-payment', label: 'Recarregar via PIX', icon: <PixIcon />, roles: ['user', 'creator', 'developer'] },
    { screen: 'livepix-payment', label: 'Recarregar via LivePix', icon: <LivePixIcon />, roles: ['user', 'creator', 'developer'] },
  ];

  const creatorItems: NavConfig[] = [
      { screen: 'create-content', label: 'Create Content', icon: <PlusSquareIcon />, roles: ['creator', 'developer'] },
      { screen: 'my-creations', label: 'My Creations', icon: <CreationsIcon />, roles: ['creator', 'developer'] },
      { screen: 'creator-payouts', label: 'Creator Payouts', icon: <PayoutsIcon />, roles: ['creator'] },
  ];

  const devItems: NavConfig[] = [
      { screen: 'developer-panel', label: 'Developer Panel', icon: <DevIcon />, roles: ['developer'] },
      { screen: 'user-plan-management', label: 'User Plans', icon: <UserPlanIcon />, roles: ['developer'] },
      { screen: 'showcase-management', label: 'Showcase Mgmt', icon: <ShowcaseIcon />, roles: ['developer'] },
      { screen: 'ux-kit', label: 'UX Kit', icon: <UXKitIcon />, roles: ['developer'] },
  ];
  
  if (!isLoggedIn) {
      return (
         <aside className="w-64 bg-neutral-800 border-r border-neutral-700 flex-shrink-0 hidden md:flex md:flex-col p-4 justify-center items-center">
             <h1 className="text-xl font-bold text-white tracking-wider">FUN<span className="text-brand-primary">FANS</span></h1>
             <p className="text-center text-neutral-400 mb-4">You are viewing as a guest.</p>
             <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center p-3 rounded-lg bg-brand-primary text-white"
             >
                <LoginIcon/>
                <span className="ml-2 font-semibold">Login / Sign Up</span>
             </button>
         </aside>
      );
  }

  return (
    <>
    {isGeminiModalOpen && <GeminiModal mode={geminiMode} onClose={() => setIsGeminiModalOpen(false)} />}
    <aside className="w-64 bg-neutral-800 border-r border-neutral-700 flex-shrink-0 hidden md:flex md:flex-col">
       <div className="p-4 border-b border-neutral-700">
           <ProfileHeader />
       </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
            <ul className="space-y-2">
            {navItems.filter(i => i.roles.includes(userRole)).map(item => (
                <NavItem
                key={item.screen}
                screen={item.screen}
                label={item.label}
                icon={item.icon}
                isActive={currentScreen === item.screen}
                onClick={() => setCurrentScreen(item.screen)}
                />
            ))}
            </ul>
        </nav>
        
        {(creatorItems.some(i => i.roles.includes(userRole)) || devItems.some(i => i.roles.includes(userRole))) && (
            <div className="px-6 py-4">
                <div className="border-t border-neutral-700"></div>
            </div>
        )}

        {creatorItems.some(i => i.roles.includes(userRole)) && (
          <div className="px-4">
            <p className="px-2 text-xs font-semibold uppercase text-neutral-500 mb-2">Creator Tools</p>
             <ul className="space-y-2">
                {creatorItems.filter(i => i.roles.includes(userRole)).map(item => (
                    <NavItem
                    key={item.screen}
                    screen={item.screen}
                    label={item.label}
                    icon={item.icon}
                    isActive={currentScreen === item.screen}
                    onClick={() => setCurrentScreen(item.screen)}
                    />
                ))}
            </ul>
          </div>
        )}

        {devItems.some(i => i.roles.includes(userRole)) && (
            <div className="px-4 mt-4">
                <p className="px-2 text-xs font-semibold uppercase text-neutral-500 mb-2">Admin Tools</p>
                <ul className="space-y-2">
                    {devItems.filter(i => i.roles.includes(userRole)).map(item => (
                        <NavItem
                        key={item.screen}
                        screen={item.screen}
                        label={item.label}
                        icon={item.icon}
                        isActive={currentScreen === item.screen}
                        onClick={() => setCurrentScreen(item.screen)}
                        />
                    ))}
                    <NavItem
                        label="Improve Platform"
                        icon={<GeminiIcon/>}
                        isActive={false}
                        onClick={() => openGeminiModal('improve')}
                    />
                     <NavItem
                        label="Analyze Project"
                        icon={<GeminiIcon/>}
                        isActive={false}
                        onClick={() => openGeminiModal('analyze')}
                    />
                    <NavItem
                        screen='design-studio'
                        label="Design Studio"
                        icon={<DesignStudioIcon/>}
                        isActive={currentScreen === 'design-studio'}
                        onClick={() => setCurrentScreen('design-studio')}
                    />
                </ul>
            </div>
        )}
      </div>

      <div className="p-4 border-t border-neutral-700">
        {userRole === 'creator' && (
            <button onClick={shareVitrine} className="w-full text-sm text-center bg-neutral-700 text-neutral-300 hover:bg-neutral-600 rounded p-2 mb-4">
                Share Vitrine
            </button>
        )}
        <button onClick={logout} className="w-full flex items-center justify-center p-3 rounded-lg bg-red-900/50 text-red-300 hover:bg-red-800/50 hover:text-white">
            <LogoutIcon />
            <span className="ml-2 font-semibold">Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

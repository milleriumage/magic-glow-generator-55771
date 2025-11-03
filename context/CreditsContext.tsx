
import React, { createContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { User, Transaction, TransactionType, ContentItem, SubscriptionPlan, UserSubscription, DevSettings, UserRole, CreatorTransaction, UserTimeout, Screen, CreditPackage } from '../types';
import { REWARD_AMOUNT, INITIAL_CONTENT_ITEMS, INITIAL_SUBSCRIPTION_PLANS, INITIAL_CREDIT_PACKAGES, INITIAL_USERS } from '../constants';

// --- DEFAULT STATES ---
const initialDevSettings: DevSettings = {
  platformCommission: 0.50, // Updated as per request
  creditValueUSD: 0.01, // Updated for more realistic value
  withdrawalCooldownHours: 24,
  maxImagesPerCard: 5,
  maxVideosPerCard: 2,
  commentsEnabled: false,
};

// --- CONTEXT TYPE ---
interface CreditsContextType {
  // State
  balance: number;
  earnedBalance: number;
  transactions: Transaction[];
  creatorTransactions: CreatorTransaction[];
  contentItems: ContentItem[];
  subscriptionPlans: SubscriptionPlan[];
  creditPackages: CreditPackage[];
  userSubscription: UserSubscription | null;
  subscriptions: Record<string, UserSubscription | null>; // Key is now user ID (string)
  devSettings: DevSettings;
  userRole: UserRole;
  currentScreen: Screen;
  unlockedContentIds: string[];
  withdrawalTimeEnd: number;
  
  // User & Social State
  isLoggedIn: boolean;
  currentUser: User | null;
  allUsers: User[];
  activeTagFilter: string | null;
  viewingCreatorId: string | null; // Changed to string

  // Showcase state
  showcasedUserIds: string[]; // Changed to string[]
  setShowcasedUserIds: (userIds: string[]) => void;

  // Theme state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // Actions
  addCredits: (amount: number, description: string, type: TransactionType) => void;
  processPurchase: (item: ContentItem) => boolean;
  addReward: () => void;
  addContentItem: (item: ContentItem) => void;
  deleteContent: (itemId: string) => boolean;
  updateSubscriptionPlan: (updatedPlan: SubscriptionPlan) => void;
  updateCreditPackage: (updatedPackage: CreditPackage) => void;
  subscribeToPlan: (plan: SubscriptionPlan) => void; // For current user
  cancelSubscription: () => void; // For current user
  subscribeUserToPlan: (userId: string, plan: SubscriptionPlan) => void; // For dev panel
  cancelUserSubscription: (userId: string) => void; // For dev panel
  addReaction: (itemId: string, emoji: string) => void;
  addLike: (itemId: string) => void;
  incrementShareCount: (itemId: string) => void;
  
  // User & Social Actions
  login: (userId: string) => void;
  logout: () => void;
  updateUserProfile: (updatedProfile: Partial<User>) => void;
  followUser: (userIdToFollow: string) => void;
  unfollowUser: (userIdToUnfollow: string) => void;
  setTagFilter: (tag: string | null) => void;
  setViewCreator: (creatorId: string | null) => void;
  shareVitrine: () => void;

  // Role & Screen Management
  setCurrentScreen: (screen: Screen) => void;

  // Dev Actions
  updateDevSettings: (settings: Partial<DevSettings>) => void;
  addCreditsToUser: (userId: string, amount: number) => void;
  toggleContentVisibility: (itemId: string) => void;
  removeContent: (itemId: string) => void;
  setTimeOut: (userId: string, durationHours: number, message: string) => void;
  hideAllContentFromCreator: (creatorId: string) => void;
  deleteAllContentFromCreator: (creatorId: string) => void;

  // Timeout Info
  isTimedOut: (userId: string) => boolean;
  timeoutInfo: (userId: string) => UserTimeout | undefined;
}

export const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
export const CreditsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Core State
  const [balance, setBalance] = useState(100);
  const [earnedBalances, setEarnedBalances] = useState<Record<string, number>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creatorTransactions, setCreatorTransactions] = useState<CreatorTransaction[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>(INITIAL_CREDIT_PACKAGES);
  const [subscriptions, setSubscriptions] = useState({} as Record<string, UserSubscription | null>);
  const [unlockedContentIds, setUnlockedContentIds] = useState<string[]>([]);
  
  // Role, Dev, and Screen State
  const [devSettings, setDevSettings] = useState<DevSettings>(initialDevSettings);
  const [timeouts, setTimeouts] = useState<Record<string, UserTimeout>>({});
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [withdrawalTimeEnd, setWithdrawalTimeEnd] = useState(0);

  // New User, Auth & Social State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [activeTagFilter, setTagFilter] = useState<string | null>(null);
  const [viewingCreatorId, setViewCreatorId] = useState<string | null>(null);

  // New Showcase & Theme State
  const [showcasedUserIds, setShowcasedUserIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
      setWithdrawalTimeEnd(Date.now() + initialDevSettings.withdrawalCooldownHours * 3600 * 1000);
  }, []);
  
  const userSubscription = useMemo(() => {
      if (!currentUser) return null;
      return subscriptions[currentUser.id] || null;
  }, [currentUser, subscriptions]);

  const earnedBalance = useMemo(() => {
    if (!currentUser) return 0;
    return earnedBalances[currentUser.id] || 0;
  }, [currentUser, earnedBalances]);


  const login = useCallback((userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentScreen('home');
      // For simulation, reset balances on login to reflect a new session
      setBalance(500); // Give user enough credits to buy content
      setEarnedBalances({}); // Reset all earnings
      setUnlockedContentIds([]);
    }
  }, [allUsers]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setViewCreatorId(null); 
  }, []);
  
  const updateUserProfile = useCallback((updatedProfile: Partial<User>) => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser, ...updatedProfile };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  }, [currentUser]);

  const followUser = useCallback((userIdToFollow: string) => {
    if (!currentUser || currentUser.id === userIdToFollow) return;
    setAllUsers(prev => prev.map(user => {
        if (user.id === currentUser.id) {
            return { ...user, following: [...new Set([...user.following, userIdToFollow])] };
        }
        if (user.id === userIdToFollow) {
             return { ...user, followers: [...new Set([...user.followers, currentUser.id])] };
        }
        return user;
    }));
    setCurrentUser(prev => prev ? { ...prev, following: [...new Set([...prev.following, userIdToFollow])] } : null);
  }, [currentUser]);

  const unfollowUser = useCallback((userIdToUnfollow: string) => {
     if (!currentUser) return;
     setAllUsers(prev => prev.map(user => {
        if (user.id === currentUser.id) {
            return { ...user, following: user.following.filter(id => id !== userIdToUnfollow) };
        }
        if (user.id === userIdToUnfollow) {
            return { ...user, followers: user.followers.filter(id => id !== currentUser.id) };
        }
        return user;
    }));
    setCurrentUser(prev => prev ? { ...prev, following: prev.following.filter(id => id !== userIdToUnfollow) } : null);
  }, [currentUser]);

  const setTagFilterCallback = useCallback((tag: string | null) => {
      setTagFilter(tag);
      setViewCreatorId(null); 
      setCurrentScreen('home');
  }, []);

  const setViewCreatorCallback = useCallback((creatorId: string | null) => {
      setViewCreatorId(creatorId);
      setTagFilter(null); 
      setCurrentScreen(creatorId ? 'view-creator' : 'home');
  }, []);

  const shareVitrine = useCallback(() => {
    if (!currentUser || !currentUser.vitrineSlug) {
        alert("Could not generate a share link.");
        return;
    }
    const url = `https://funfans.com/vitrine/${currentUser.vitrineSlug}`;
    navigator.clipboard.writeText(url);
    alert(`Link copied to clipboard!\n${url}`);
  }, [currentUser]);

  const addTransaction = (trans: Omit<Transaction, 'id' | 'timestamp'>) => {
     setTransactions(prev => [
      { id: Date.now().toString(), timestamp: new Date().toISOString(), ...trans },
      ...prev,
    ]);
  };

  const addCredits = useCallback((amount: number, description: string, type: TransactionType) => {
    setBalance(prev => prev + amount);
    addTransaction({ type, amount, description });
  }, []);

  const processPurchase = useCallback((item: ContentItem) => {
    if (!currentUser) return false;
    if (balance >= item.price) {
      setBalance(prev => prev - item.price);
      addTransaction({ type: TransactionType.PURCHASE, amount: -item.price, description: `Purchase of ${item.title}` });

      const earnings = item.price * (1 - devSettings.platformCommission);
      
      setEarnedBalances(prev => ({
          ...prev,
          [item.creatorId]: (prev[item.creatorId] || 0) + earnings
      }));

      setCreatorTransactions(prev => [
          {
              id: `ctx_${Date.now()}`,
              cardId: item.id,
              cardTitle: item.title,
              buyerId: currentUser.id,
              amountReceived: earnings,
              originalPrice: item.price,
              timestamp: new Date().toISOString(),
              mediaCount: item.mediaCount,
          },
          ...prev
      ]);
      
      setUnlockedContentIds(prev => [...prev, item.id]);

      return true;
    }
    return false;
  }, [balance, devSettings.platformCommission, currentUser]);
  
  const addReward = useCallback(() => {
    addCredits(REWARD_AMOUNT, 'Credits from watching ad', TransactionType.REWARD);
  }, [addCredits]);

  const addContentItem = useCallback((item: ContentItem) => {
    setContentItems(prev => [item, ...prev]);
  }, []);

  const deleteContent = useCallback((itemId: string): boolean => {
    const item = contentItems.find(i => i.id === itemId);
    if (!item) return false;

    const canDelete = (Date.now() - new Date(item.createdAt).getTime()) > 24 * 60 * 60 * 1000;
    if (canDelete) {
        setContentItems(prev => prev.filter(i => i.id !== itemId));
        return true;
    }
    return false;
  }, [contentItems]);

  const updateSubscriptionPlan = useCallback((updatedPlan: SubscriptionPlan) => {
    setSubscriptionPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  }, []);

   const updateCreditPackage = useCallback((updatedPackage: CreditPackage) => {
    setCreditPackages(prev => prev.map(p => p.id === updatedPackage.id ? updatedPackage : p));
  }, []);

  const subscribeToPlan = useCallback((plan: SubscriptionPlan) => {
    if (!currentUser) return;
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    const newSubscription: UserSubscription = {
        ...plan,
        renewsOn: renewalDate.toISOString(),
        paymentMethod: 'Credit Card ending **** 4242'
    };
    setSubscriptions(prev => ({...prev, [currentUser.id]: newSubscription}));
    addCredits(plan.credits, `Subscription credits for ${plan.name} plan`, TransactionType.SUBSCRIPTION);
  }, [addCredits, currentUser]);

  const cancelSubscription = useCallback(() => {
    if (userSubscription && currentUser) {
        addTransaction({ type: TransactionType.SUBSCRIPTION, amount: 0, description: `Canceled ${userSubscription.name} plan` });
        setSubscriptions(prev => {
            const newSubs = {...prev};
            delete newSubs[currentUser.id];
            return newSubs;
        });
    }
  }, [userSubscription, currentUser]);

  const subscribeUserToPlan = useCallback((userId: string, plan: SubscriptionPlan) => {
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    const newSubscription: UserSubscription = {
        ...plan,
        renewsOn: renewalDate.toISOString(),
        paymentMethod: 'Admin Assigned'
    };
    
    setSubscriptions(prev => ({...prev, [userId]: newSubscription}));
  }, []);

  const cancelUserSubscription = useCallback((userId: string) => {
    const subToCancel = subscriptions[userId];
    if (subToCancel) {
        addTransaction({ type: TransactionType.SUBSCRIPTION, amount: 0, description: `Admin Canceled ${subToCancel.name} for ${userId}` });
        setSubscriptions(prev => {
            const newSubs = {...prev};
            delete newSubs[userId];
            return newSubs;
        });
    }
  }, [subscriptions]);

  const addReaction = useCallback((itemId: string, emoji: string) => {
    if (!currentUser) return;
    setContentItems(prev => prev.map(item => {
        if (item.id === itemId) {
            const newUserReactions = { ...item.userReactions };
            if (newUserReactions[currentUser.id] === emoji) {
                 delete newUserReactions[currentUser.id];
            } else {
                newUserReactions[currentUser.id] = emoji;
            }
            return { ...item, userReactions: newUserReactions };
        }
        return item;
    }));
  }, [currentUser]);

  const addLike = useCallback((itemId: string) => {
      if (!currentUser) return;
      setContentItems(prev => prev.map(item => {
          if (item.id === itemId) {
              const hasLiked = item.likedBy.includes(currentUser.id);
              const newLikedBy = hasLiked 
                  ? item.likedBy.filter(id => id !== currentUser.id)
                  : [...item.likedBy, currentUser.id];
              return { ...item, likedBy: newLikedBy };
          }
          return item;
      }));
  }, [currentUser]);

  const incrementShareCount = useCallback((itemId: string) => {
    if (!currentUser) return;
    setContentItems(prev => prev.map(item => {
        if (item.id === itemId) {
            if (!item.sharedBy.includes(currentUser.id)) {
                return { ...item, sharedBy: [...item.sharedBy, currentUser.id] };
            }
        }
        return item;
    }));
  }, [currentUser]);

  const updateDevSettings = useCallback((settings: Partial<DevSettings>) => {
    setDevSettings(prev => ({...prev, ...settings}));
  }, []);

  const addCreditsToUser = useCallback((userId: string, amount: number) => {
      // This is a simulation. In a real app, you'd target a specific user's balance.
      // Here, we add to the current user's balance for demonstration if they are the target.
      if (currentUser?.id === userId) {
          setBalance(prev => prev + amount);
          addTransaction({ type: TransactionType.CREDIT_PURCHASE, amount: amount, description: `Admin grant for user ${userId}`})
      } else {
          console.log(`(Simulated) Added ${amount} credits to user ${userId}. Balance would update if you were logged in as them.`);
      }
  }, [currentUser]);
  
  const toggleContentVisibility = useCallback((itemId: string) => {
      setContentItems(prev => prev.map(item => item.id === itemId ? {...item, isHidden: !item.isHidden} : item));
  }, []);

  const removeContent = useCallback((itemId: string) => {
      setContentItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const hideAllContentFromCreator = useCallback((creatorId: string) => {
      setContentItems(prev => prev.map(item => item.creatorId === creatorId ? {...item, isHidden: true} : item));
  }, []);

  const deleteAllContentFromCreator = useCallback((creatorId: string) => {
      setContentItems(prev => prev.filter(item => item.creatorId !== creatorId));
  }, []);

  const setTimeOut = useCallback((userId: string, durationHours: number, message: string) => {
      const endTime = Date.now() + durationHours * 60 * 60 * 1000;
      setTimeouts(prev => ({...prev, [userId]: { userId, endTime, message }}));
  }, []);

  const isTimedOut = useCallback((userId: string) => {
      const timeout = timeouts[userId];
      return timeout && Date.now() < timeout.endTime;
  }, [timeouts]);

  const timeoutInfo = useCallback((userId: string) => {
      return timeouts[userId];
  }, [timeouts]);
  
  const contextValue = useMemo(() => ({
    balance,
    earnedBalance,
    transactions,
    creatorTransactions,
    contentItems: contentItems.filter(item => (currentUser?.role === 'developer' || !item.isHidden)),
    subscriptionPlans,
    creditPackages,
    userSubscription,
    subscriptions,
    devSettings,
    userRole: currentUser?.role ?? 'user',
    currentScreen,
    unlockedContentIds,
    withdrawalTimeEnd,
    isLoggedIn,
    currentUser,
    allUsers,
    activeTagFilter,
    viewingCreatorId,
    showcasedUserIds,
    setShowcasedUserIds,
    theme,
    setTheme,
    addCredits,
    processPurchase,
    addReward,
    addContentItem,
    deleteContent,
    updateSubscriptionPlan,
    updateCreditPackage,
    subscribeToPlan,
    cancelSubscription,
    subscribeUserToPlan,
    cancelUserSubscription,
    addReaction,
    addLike,
    incrementShareCount,
    login,
    logout,
    updateUserProfile,
    followUser,
    unfollowUser,
    setTagFilter: setTagFilterCallback,
    setViewCreator: setViewCreatorCallback,
    shareVitrine,
    setCurrentScreen,
    updateDevSettings,
    addCreditsToUser,
    toggleContentVisibility,
    removeContent,
    setTimeOut,
    hideAllContentFromCreator,
    deleteAllContentFromCreator,
    isTimedOut,
    timeoutInfo,
  }), [
      balance, earnedBalance, transactions, creatorTransactions, contentItems, 
      subscriptionPlans, creditPackages, userSubscription, subscriptions, devSettings, currentUser, currentScreen,
      unlockedContentIds, withdrawalTimeEnd, isLoggedIn, allUsers, activeTagFilter, viewingCreatorId,
      showcasedUserIds, theme,
      addCredits, processPurchase, addReward, addContentItem, deleteContent,
      updateSubscriptionPlan, updateCreditPackage, subscribeToPlan, cancelSubscription, subscribeUserToPlan, cancelUserSubscription,
      addReaction, addLike, incrementShareCount,
      login, logout, updateUserProfile, followUser, unfollowUser, setTagFilterCallback, setViewCreatorCallback, shareVitrine,
      setCurrentScreen, updateDevSettings, addCreditsToUser, toggleContentVisibility,
      removeContent, setTimeOut, hideAllContentFromCreator, deleteAllContentFromCreator, isTimedOut, timeoutInfo
  ]);

  return (
    <CreditsContext.Provider value={contextValue}>
      {children}
    </CreditsContext.Provider>
  );
};
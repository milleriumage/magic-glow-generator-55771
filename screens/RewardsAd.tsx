
import React, { useState, useEffect, useCallback } from 'react';
import { REWARD_AMOUNT } from '../constants';
import { useCredits } from '../hooks/useCredits';
import { rewardCredit } from '../services/mockApi';
import Notification from '../components/Notification';
import { Screen } from '../types';

const AD_DURATION = 30; // seconds

interface RewardsAdProps {
  navigate: (screen: Screen) => void;
}

const RewardsAd: React.FC<RewardsAdProps> = ({ navigate }) => {
  const { balance, addReward } = useCredits();
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(AD_DURATION);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const startAd = () => {
    setIsWatching(true);
    setCountdown(AD_DURATION);
  };

  const handleReward = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await rewardCredit(REWARD_AMOUNT, balance, addReward);
      setNotification(result.message);
      setTimeout(() => {
        setNotification(null);
        navigate('home');
      }, 2000);
    } catch (error) {
      console.error("Reward failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [balance, addReward, navigate]);


  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isWatching && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (isWatching && countdown === 0) {
      setIsWatching(false);
      handleReward();
    }
    return () => clearTimeout(timer);
  }, [isWatching, countdown, handleReward]);

  const progress = ((AD_DURATION - countdown) / AD_DURATION) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      {notification && <Notification message={notification} type="success" />}

      {!isWatching && !isLoading && (
        <>
            <div className="mb-8">
                <span className="text-6xl" role="img" aria-label="gift">🎁</span>
            </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Earn Free Credits!</h1>
          <p className="text-lg text-neutral-300 max-w-md mb-8">
            Watch a quick 30-second ad and receive <span className="font-bold text-accent-gold">{REWARD_AMOUNT} credits</span> instantly in your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
                onClick={startAd}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-lg flex items-center justify-center"
            >
                🎁 Watch & Earn Credits
            </button>
            <button 
                onClick={startAd}
                className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-lg flex items-center justify-center"
            >
                🧪 Test Reward
            </button>
          </div>
        </>
      )}

      {isWatching && (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Ad in progress...</h2>
          <p className="text-neutral-300 mb-6">Please wait {countdown} seconds to receive your reward.</p>
          <div className="w-full bg-neutral-700 rounded-full h-4">
            <div className="bg-brand-primary h-4 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {isLoading && (
         <div className="flex flex-col items-center">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl text-white mt-4">Validating your reward...</p>
         </div>
      )}
    </div>
  );
};

export default RewardsAd;

import React, { useState } from 'react';
import { ContentItem } from '../types';
import { useCredits } from '../hooks/useCredits';

interface ConfirmPurchaseModalProps {
  item: ContentItem;
  onClose: () => void;
  onConfirm: () => void;
  onError: (error: string) => void;
}

const CoinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent-gold"><circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.71a6 6 0 1 1-2.39 7.64"></path><path d="M12 6h.01"></path></svg>
);


const ConfirmPurchaseModal: React.FC<ConfirmPurchaseModalProps> = ({ item, onClose, onConfirm, onError }) => {
  const { balance, processPurchase, isLoggedIn, login } = useCredits();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    setTimeout(() => {
        const success = processPurchase(item);
        if (success) {
            onConfirm();
        } else {
            onError('An unknown error occurred.');
        }
        setIsLoading(false);
    }, 1000);
  };
  
  if (!isLoggedIn) {
      return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-neutral-800 rounded-xl shadow-2xl p-8 w-full max-w-md text-center transform transition-all" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-4">Login to Purchase</h2>
                <p className="text-neutral-300 mb-6">
                You need an account to unlock content. Please log in or sign up to continue.
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                    Login / Sign Up
                </button>
                 <button onClick={onClose} className="w-full mt-3 text-neutral-400 hover:text-white py-2 rounded-lg transition-colors">
                    Cancel
                </button>
            </div>
        </div>
      );
  }

  const hasEnoughCredits = balance >= item.price;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-neutral-800 rounded-xl shadow-2xl p-8 w-full max-w-md text-center transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">Confirm Purchase</h2>
        <p className="text-neutral-300 mb-6">
          You are about to use your credits to unlock "{item.title}".
        </p>
        <div className="bg-neutral-900 rounded-lg p-4 mb-6">
            <p className="text-neutral-400 text-sm">Content Cost</p>
            <div className="flex items-center justify-center text-3xl font-bold text-accent-gold my-2">
                <CoinIcon/>
                <span className="ml-2">{item.price}</span>
            </div>
             <p className={`text-sm ${hasEnoughCredits ? 'text-neutral-400' : 'text-accent-red'}`}>
                Your balance: {balance.toLocaleString('en-US')}
            </p>
        </div>
        
        {hasEnoughCredits ? (
          <button 
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirming...
                </>
            ) : `Confirm & Spend ${item.price} Credits`}
          </button>
        ) : (
            <div className="text-center p-4 rounded-lg bg-red-500/20 text-accent-red">
                <p className="font-semibold">Insufficient Credits</p>
                <p className="text-sm">You need {item.price - balance} more credits.</p>
            </div>
        )}
        <button onClick={onClose} className="w-full mt-3 text-neutral-400 hover:text-white py-2 rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmPurchaseModal;
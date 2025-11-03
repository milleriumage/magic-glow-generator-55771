
import React, { useState } from 'react';
import { useCredits } from '../hooks/useCredits';

interface CancelSubscriptionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({ onClose, onSuccess }) => {
    const { userSubscription, cancelSubscription } = useCredits();
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            cancelSubscription();
            setIsLoading(false);
            onSuccess();
            onClose();
        }, 1500);
    };

    if (!userSubscription) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-neutral-800 rounded-xl shadow-2xl p-8 w-full max-w-md text-center transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">Cancel Subscription</h2>
        <p className="text-neutral-300 mb-6">
          Are you sure you want to cancel your <span className="font-semibold text-white">{userSubscription.name}</span> plan? Your benefits will remain active until the end of the current billing period.
        </p>
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-accent-red hover:bg-accent-red/90 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Canceling...
                </>
            ) : 'Yes, Cancel Subscription'}
          </button>
           <button onClick={onClose} className="w-full text-neutral-400 hover:text-white py-2 rounded-lg transition-colors">
            Keep My Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;

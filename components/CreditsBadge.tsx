
import React from 'react';
import { useCredits } from '../hooks/useCredits';

const CoinIcon: React.FC<{color: string}> = ({color}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${color}`}><circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.71a6 6 0 1 1-2.39 7.64"></path><path d="M12 6h.01"></path></svg>
);

const CreditsBadge: React.FC = () => {
  const { balance } = useCredits();

  return (
    <div className={`flex items-center space-x-2 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2`}>
      <CoinIcon color="text-accent-gold" />
      <span className="text-white font-semibold text-base">
        <span className="text-accent-green">{balance.toLocaleString('en-US')}</span>
        <span className="text-neutral-300 ml-2">Credits</span>
      </span>
    </div>
  );
};

export default CreditsBadge;
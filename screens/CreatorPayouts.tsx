
import React, { useState, useEffect } from 'react';
import { useCredits } from '../hooks/useCredits';
import { CreatorTransaction } from '../types';

const PayoutsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;

const CreatorPayouts: React.FC = () => {
    const { earnedBalance, creatorTransactions, devSettings, withdrawalTimeEnd } = useCredits();
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = Math.max(0, withdrawalTimeEnd - Date.now());
            setTimeLeft(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [withdrawalTimeEnd]);
    
    const formatTime = (ms: number) => {
        if (ms <= 0) return "0s";
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        let timeString = '';
        if (days > 0) timeString += `${days}d `;
        if (hours > 0 || days > 0) timeString += `${hours}h `;
        if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
        timeString += `${seconds}s`;
        
        return timeString.trim();
    };

    const isWithdrawalReady = timeLeft <= 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Creator Payouts</h1>
                <p className="text-neutral-400">Manage your earnings and withdrawals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-neutral-800 rounded-lg p-6 text-center">
                    <h2 className="text-sm font-semibold text-neutral-400 uppercase">Earned Balance</h2>
                    <p className="text-5xl font-bold text-blue-400 mt-2">{earnedBalance.toLocaleString('en-US')}</p>
                    <p className="text-neutral-300 mt-1">credits</p>
                </div>
                <div className="bg-neutral-800 rounded-lg p-6 text-center">
                     <h2 className="text-sm font-semibold text-neutral-400 uppercase">Estimated Value</h2>
                    <p className="text-5xl font-bold text-accent-green mt-2">${(earnedBalance * devSettings.creditValueUSD).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-neutral-300 mt-1">USD (1 credit = ${devSettings.creditValueUSD})</p>
                </div>
            </div>

            <div className="bg-neutral-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Withdraw Funds</h2>
                <div className="text-center border border-neutral-700 rounded-lg p-4">
                    <p className="text-neutral-400 mb-2">Next withdrawal available in:</p>
                    <p className="text-3xl font-mono font-bold text-white">{formatTime(timeLeft)}</p>
                </div>
                <button 
                    disabled={!isWithdrawalReady}
                    className="w-full mt-4 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:bg-neutral-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
                >
                    <PayoutsIcon />
                    <span className="ml-2">Withdraw ${ (earnedBalance * devSettings.creditValueUSD).toFixed(2) }</span>
                </button>
                <p className="text-center text-xs text-neutral-500 mt-2">*A platform fee of {devSettings.platformCommission * 100}% applies to all earnings.</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Earnings History</h2>
                 <div className="bg-neutral-800 rounded-lg shadow-lg">
                    {creatorTransactions.length > 0 ? (
                        <ul className="divide-y divide-neutral-700">
                            {creatorTransactions.map((tx: CreatorTransaction) => (
                            <li key={tx.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">Sale of "{tx.cardTitle}"</p>
                                    <p className="text-sm text-neutral-400">
                                        Purchased by User ID: {tx.buyerId} on {new Date(tx.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-blue-400">
                                       +{tx.amountReceived.toLocaleString('en-US')}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                       (Original: {tx.originalPrice})
                                    </p>
                                </div>
                            </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-neutral-400">No earnings found yet.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default CreatorPayouts;
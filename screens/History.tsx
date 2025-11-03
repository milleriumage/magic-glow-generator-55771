
import React from 'react';
import { useCredits } from '../hooks/useCredits';
import { type Transaction, TransactionType } from '../types';

const TransactionIcon: React.FC<{ type: TransactionType }> = ({ type }) => {
  const baseClasses = "h-8 w-8 mr-4 rounded-full flex items-center justify-center text-lg font-bold";
  switch (type) {
    case TransactionType.CREDIT_PURCHASE:
      return <div className={`${baseClasses} bg-blue-500/20 text-blue-400`}>+</div>;
    case TransactionType.REWARD:
      return <div className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>🎁</div>;
    case TransactionType.PURCHASE:
      return <div className={`${baseClasses} bg-red-500/20 text-red-400`}>-</div>;
    case TransactionType.SUBSCRIPTION:
        return <div className={`${baseClasses} bg-purple-500/20 text-purple-400`}>⭐</div>;
    default:
      return <div className={`${baseClasses} bg-gray-500/20 text-gray-400`}>?</div>;
  }
};

const History: React.FC = () => {
  const { transactions } = useCredits();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Transaction History</h1>
      <p className="text-neutral-400 mb-6">Your history of spending and earning credits.</p>
      <div className="bg-neutral-800 rounded-lg shadow-lg">
        {transactions.length > 0 ? (
          <ul className="divide-y divide-neutral-700">
            {transactions.map((tx: Transaction) => (
              <li key={tx.id} className="p-4 sm:p-6 flex justify-between items-center hover:bg-neutral-700/50 transition-colors duration-200">
                <div className="flex items-center">
                  <TransactionIcon type={tx.type} />
                  <div>
                    <p className="font-semibold text-white">{tx.description}</p>
                    <p className="text-sm text-neutral-400">{new Date(tx.timestamp).toLocaleString('en-US')}</p>
                  </div>
                </div>
                <p className={`font-bold text-lg ${tx.amount > 0 ? 'text-accent-green' : (tx.amount < 0 ? 'text-accent-red' : 'text-neutral-400')}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 px-6">
            <p className="text-neutral-400">No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

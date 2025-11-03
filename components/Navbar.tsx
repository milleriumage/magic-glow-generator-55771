
import React from 'react';
import CreditsBadge from './CreditsBadge';
import { Screen } from '../types';

interface NavbarProps {
  navigate: (screen: Screen) => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const Navbar: React.FC<NavbarProps> = ({ navigate }) => {
  return (
    <nav className="flex-shrink-0 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16">
          <div className="flex items-center space-x-4">
            <CreditsBadge />
            <button 
              onClick={() => navigate('store')}
              className="hidden sm:flex items-center bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
            >
              <PlusIcon />
              Add Credits
            </button>
             <button 
              onClick={() => navigate('manage-subscription')}
              className="hidden sm:flex items-center bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
            >
              Plan
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

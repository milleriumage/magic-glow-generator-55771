
import { useContext } from 'react';
import { CreditsContext } from '../context/CreditsContext';

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};

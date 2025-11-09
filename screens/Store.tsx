import React, { useState, useEffect } from 'react';
import { useCredits } from '../hooks/useCredits';
import { supabase } from '../src/integrations/supabase/client';
import { TransactionType, Screen, SubscriptionPlan, CreditPackage } from '../types';
import Notification from '../components/Notification';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';
import EditPlanModal from '../components/EditPlanModal';
import EditCreditPackModal from '../components/EditCreditPackModal';

const Store: React.FC<{ navigate: (screen: Screen) => void; }> = ({ navigate }) => {
    const { addCredits, subscriptionPlans, creditPackages, userSubscription, userRole, isLoggedIn } = useCredits();
    const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [activeTab, setActiveTab] = useState<'credits' | 'plans'>('credits');
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
    const [editingCreditPack, setEditingCreditPack] = useState<CreditPackage | null>(null);

    const isDeveloper = userRole === 'developer';

    const handlePurchase = async (pkg: typeof creditPackages[0]) => {
        // Check if user is logged in
        if (!isLoggedIn) {
            setNotification({ message: 'Please login to purchase credits', type: 'error' });
            setTimeout(() => {
                setNotification(null);
                navigate('login');
            }, 2000);
            return;
        }

        setLoadingPackage(pkg.id);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                throw new Error('No active session. Please login.');
            }

            const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
                body: { type: 'credit_package', id: pkg.id }
            });

            if (error) throw error;

            if (data.url) {
                // Redirect to Stripe checkout
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Failed to create Stripe checkout:", error);
            setNotification({ message: error.message || 'Failed to create checkout session', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            setLoadingPackage(null);
        }
    };

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

  return (
    <div className="max-w-4xl mx-auto">
      {notification && <Notification message={notification.message} type={notification.type} />}
      {editingPlan && <EditPlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} />}
      {editingCreditPack && <EditCreditPackModal creditPackage={editingCreditPack} onClose={() => setEditingCreditPack(null)} />}


      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Store</h1>
        <p className="mt-4 text-xl text-neutral-300">Choose the best option for you and enjoy the content.</p>
      </div>

      <div className="border-b border-neutral-700 mb-8">
        <div className="flex">
            <button
                onClick={() => setActiveTab('credits')}
                className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${activeTab === 'credits' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
                Credit Packs
            </button>
            <button
                onClick={() => setActiveTab('plans')}
                className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${activeTab === 'plans' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
                Subscription Plans
            </button>
        </div>
      </div>

      {activeTab === 'credits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {creditPackages.map(pkg => (
              <div key={pkg.id} className={`relative rounded-xl p-8 border ${pkg.bestValue ? 'border-brand-primary bg-neutral-800 shadow-lg shadow-brand-primary/20' : 'border-neutral-700 bg-neutral-800/50'}`}>
                {isDeveloper && (
                    <button onClick={() => setEditingCreditPack(pkg)} className="absolute top-4 right-4 bg-neutral-700 hover:bg-neutral-600 p-2 rounded-full z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 text-white"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </button>
                )}
                {pkg.bestValue && (
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center px-4 py-1 text-sm font-semibold text-white bg-brand-primary rounded-full">BEST VALUE</span>
                    </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-white">{pkg.credits.toLocaleString('en-US')} Credits</h3>
                  {pkg.bonus > 0 && <p className="text-brand-light mt-1">+ {pkg.bonus.toLocaleString('en-US')} Bonus!</p>}
                  <p className="mt-6 text-5xl font-bold tracking-tight text-white">${pkg.price.toFixed(2)}</p>
                  
                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={!!loadingPackage}
                    className={`mt-8 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 transition duration-150 ease-in-out ${
                        pkg.bestValue 
                        ? 'bg-brand-primary hover:bg-brand-primary/90' 
                        : 'bg-neutral-700 hover:bg-neutral-600'
                    } ${loadingPackage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {loadingPackage === pkg.id ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'plans' && (
         <div>
            {userSubscription && (
                <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg mb-8 text-center">
                    <p>You are currently subscribed to the <span className="font-bold">{userSubscription.name}</span> plan. </p>
                    <p>Please <button onClick={() => navigate('manage-subscription')} className="font-bold underline hover:text-white">cancel your current plan</button> to subscribe to a new one.</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {subscriptionPlans.map(plan => (
                    <SubscriptionPlanCard 
                        key={plan.id}
                        plan={plan}
                        isAdmin={isDeveloper}
                        onEdit={() => setEditingPlan(plan)}
                    />
                ))}
            </div>
         </div>
      )}

      <div className="mt-12 text-center text-neutral-400">
        <p className="flex items-center justify-center"><CheckIcon /> Secure payments via Stripe.</p>
        <p className="flex items-center justify-center mt-2"><CheckIcon /> Credits are added instantly.</p>
      </div>
    </div>
  );
};

export default Store;
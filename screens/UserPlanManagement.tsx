import React, { useState, useMemo, useEffect } from 'react';
import { useCredits } from '../hooks/useCredits';
import { UserRole, SubscriptionPlan, User } from '../types';

const UserPlanManagement: React.FC = () => {
    const { 
        allUsers, 
        subscriptions, 
        subscriptionPlans, 
        subscribeUserToPlan, 
        cancelUserSubscription,
        transactions,
        creatorTransactions,
        earnedBalance
    } = useCredits();
    
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'plans' | 'history' | 'payouts'>('plans');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
    
    const filteredUsers = useMemo(() => {
        if (roleFilter === 'all') return allUsers;
        return allUsers.filter(u => u.role === roleFilter);
    }, [allUsers, roleFilter]);

    useEffect(() => {
        if (selectedUserId && !filteredUsers.find(u => u.id === selectedUserId)) {
            setSelectedUserId('');
        }
    }, [roleFilter, filteredUsers, selectedUserId]);

    const selectedUser = allUsers.find(u => u.id === selectedUserId);
    const selectedUserSubscription = selectedUserId ? subscriptions[selectedUserId] : null;

    const handleAssignPlan = (plan: SubscriptionPlan) => {
        if (selectedUserId) {
            subscribeUserToPlan(selectedUserId, plan);
            alert(`Plan '${plan.name}' assigned to ${selectedUser?.username}.`);
        }
    };

    const handleCancelPlan = () => {
        if (selectedUserId) {
            cancelUserSubscription(selectedUserId);
            alert(`Subscription canceled for ${selectedUser?.username}.`);
        }
    };
    
    const TabButton: React.FC<{tab: 'plans' | 'history' | 'payouts', label: string}> = ({tab, label}) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === tab ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
        >
            {label}
        </button>
    );

    const RoleFilterButton: React.FC<{ filter: UserRole | 'all'; label: string }> = ({ filter, label }) => (
        <button
            onClick={() => setRoleFilter(filter)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                roleFilter === filter ? 'bg-brand-primary text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">User Plan Management</h1>
                <p className="text-neutral-400">Assign or cancel subscription plans for any user.</p>
            </div>
            
            <div className="bg-neutral-800 p-4 rounded-lg space-y-3">
                 <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Filter by Role</label>
                    <div className="flex flex-wrap gap-2">
                        <RoleFilterButton filter="all" label="All" />
                        <RoleFilterButton filter="creator" label="Creators" />
                        <RoleFilterButton filter="user" label="Users" />
                        <RoleFilterButton filter="developer" label="Developers" />
                    </div>
                </div>
                <div>
                    <label htmlFor="user-select" className="block text-sm font-medium text-neutral-300 mb-1">Select User</label>
                    <select 
                        id="user-select"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full bg-neutral-700 border-neutral-600 rounded-md py-2 px-3 text-white"
                    >
                        <option value="">-- Select a user from '{roleFilter}' list ({filteredUsers.length}) --</option>
                        {filteredUsers.map(user => (
                            <option key={user.id} value={user.id}>{user.username} ({user.role})</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedUser && (
                <div className="animate-fade-in-down">
                     <div className="border-b border-neutral-700">
                        <div className="flex">
                            <TabButton tab="plans" label="Plan Management" />
                            <TabButton tab="history" label="Transaction History" />
                            <TabButton tab="payouts" label="Creator Payouts" />
                        </div>
                    </div>
                    <div className="bg-neutral-800 p-6 rounded-b-lg">
                        {activeTab === 'plans' && (
                             <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Current Status for <span className="text-brand-light">{selectedUser.username}</span>
                                </h2>
                                {selectedUserSubscription ? (
                                    <div className="bg-green-900/50 border border-green-700 p-4 rounded-lg">
                                        <p className="font-semibold text-green-300">Active Plan: {selectedUserSubscription.name}</p>
                                        <p className="text-sm text-green-400">Renews on: {new Date(selectedUserSubscription.renewsOn).toLocaleDateString()}</p>
                                        <button onClick={handleCancelPlan} className="mt-2 text-xs bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded">
                                            Cancel Subscription
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-neutral-700 p-4 rounded-lg text-center">
                                        <p className="text-neutral-300">This user has no active subscription.</p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mt-6 mb-2">Available Plans</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {subscriptionPlans.map(plan => (
                                            <div key={plan.id} className="bg-neutral-700 p-4 rounded-lg flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-white">{plan.name}</p>
                                                    <p className="text-sm text-neutral-400">${plan.price}/mo - {plan.credits} credits</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleAssignPlan(plan)}
                                                    className="bg-brand-secondary hover:bg-brand-secondary/80 text-white font-semibold py-2 px-4 rounded-lg"
                                                >
                                                    Assign
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'history' && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-2">Transaction History for {selectedUser.username}</h2>
                                <p className="text-sm text-neutral-500 mb-4">(Note: In this simulation, the global transaction history is shown.)</p>
                                <ul className="divide-y divide-neutral-700 max-h-96 overflow-y-auto">
                                    {transactions.map(tx => (
                                        <li key={tx.id} className="py-2">
                                            <p className="font-semibold text-white">{tx.description} ({tx.amount} credits)</p>
                                            <p className="text-xs text-neutral-400">{new Date(tx.timestamp).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === 'payouts' && (
                              <div>
                                <h2 className="text-xl font-semibold text-white mb-2">Creator Payouts for {selectedUser.username}</h2>
                                <p className="text-sm text-neutral-500 mb-4">(Note: In this simulation, global creator data is shown.)</p>
                                <p className="text-lg text-white">Current Earned Balance: <span className="font-bold text-blue-400">{earnedBalance.toLocaleString()} credits</span></p>
                                 <ul className="divide-y divide-neutral-700 max-h-96 overflow-y-auto mt-4">
                                    {creatorTransactions.map(tx => (
                                        <li key={tx.id} className="py-2">
                                            <p className="font-semibold text-white">Sale of "{tx.cardTitle}" (+{tx.amountReceived} credits)</p>
                                            <p className="text-xs text-neutral-400">Buyer: {tx.buyerId} on {new Date(tx.timestamp).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPlanManagement;
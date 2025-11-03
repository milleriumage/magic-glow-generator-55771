import React, { useState, useMemo } from 'react';
import { useCredits } from '../hooks/useCredits';
import { DevSettings, UserRole } from '../types';
import DevSection from '../components/DevSection';

const DeveloperPanel: React.FC = () => {
    const { devSettings, updateDevSettings, addCreditsToUser, contentItems, setTimeOut, allUsers, hideAllContentFromCreator, deleteAllContentFromCreator } = useCredits();
    
    const [localSettings, setLocalSettings] = useState<DevSettings>(devSettings);
    const [addCreditsData, setAddCreditsData] = useState({ userId: '', amount: '' });
    const [timeoutData, setTimeoutData] = useState({ userId: '', duration: '', message: ''});
    const [selectedUserForModeration, setSelectedUserForModeration] = useState<string>('');

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const isChecked = (e.target as HTMLInputElement).checked;
        setLocalSettings(prev => ({ ...prev, [name]: isCheckbox ? isChecked : Number(value) || value }));
    };

    const handleSaveSettings = () => {
        updateDevSettings(localSettings);
        alert('Settings saved!');
    };

    const handleAddCredits = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(addCreditsData.amount, 10);
        if (amount > 0 && addCreditsData.userId) {
            addCreditsToUser(addCreditsData.userId, amount);
            alert(`Added ${amount} credits to user ID ${addCreditsData.userId}`);
            setAddCreditsData({ userId: '', amount: '' });
        }
    };

    const handleTimeout = (e: React.FormEvent) => {
        e.preventDefault();
        const duration = parseInt(timeoutData.duration, 10);
        if (duration > 0 && timeoutData.message && timeoutData.userId) {
            setTimeOut(timeoutData.userId, duration, timeoutData.message);
            alert(`User ID ${timeoutData.userId} has been timed out for ${duration} hours.`);
            setTimeoutData({ userId: '', duration: '', message: '' });
        }
    };
    
    const moderatedUserContent = useMemo(() => {
        if (!selectedUserForModeration) return [];
        return contentItems.filter(item => item.creatorId === selectedUserForModeration);
    }, [selectedUserForModeration, contentItems]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Developer Panel</h1>
                <p className="text-neutral-400">Manage platform-wide settings and users.</p>
            </div>

            <DevSection title="Platform Economy">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300">Platform Commission (%)</label>
                        <input type="number" name="platformCommission" value={localSettings.platformCommission * 100} onChange={e => setLocalSettings({...localSettings, platformCommission: Number(e.target.value) / 100})} className="mt-1 w-full bg-neutral-900 border-neutral-600 rounded p-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-300">Credit Value (USD)</label>
                        <input type="number" name="creditValueUSD" step="0.001" value={localSettings.creditValueUSD} onChange={handleSettingsChange} className="mt-1 w-full bg-neutral-900 border-neutral-600 rounded p-2 text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-300">Withdrawal Cooldown (Hours)</label>
                        <input type="number" name="withdrawalCooldownHours" value={localSettings.withdrawalCooldownHours} onChange={handleSettingsChange} className="mt-1 w-full bg-neutral-900 border-neutral-600 rounded p-2 text-white" />
                    </div>
                </div>
                <button onClick={handleSaveSettings} className="mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg">Save Economy Settings</button>
            </DevSection>

             <DevSection title="User Management">
                <form onSubmit={handleAddCredits} className="space-y-4 p-4 border border-neutral-700 rounded-lg">
                    <h3 className="font-semibold text-white">Add Credits to User</h3>
                    <div className="flex gap-4">
                        <select value={addCreditsData.userId} onChange={e => setAddCreditsData({...addCreditsData, userId: e.target.value})} className="bg-neutral-900 border-neutral-600 rounded p-2 text-white">
                            <option value="">Select User...</option>
                            {allUsers.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
                        </select>
                        <input type="number" placeholder="Amount" value={addCreditsData.amount} onChange={e => setAddCreditsData({...addCreditsData, amount: e.target.value})} className="flex-grow bg-neutral-900 border-neutral-600 rounded p-2 text-white" />
                        <button type="submit" className="bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg">Add</button>
                    </div>
                </form>
                 <form onSubmit={handleTimeout} className="space-y-4 p-4 border border-neutral-700 rounded-lg mt-4">
                    <h3 className="font-semibold text-white">Issue Timeout</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={timeoutData.userId} onChange={e => setTimeoutData({...timeoutData, userId: e.target.value})} className="bg-neutral-900 border-neutral-600 rounded p-2 text-white">
                             <option value="">Select User...</option>
                            {allUsers.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
                        </select>
                        <input type="number" placeholder="Duration (hours)" value={timeoutData.duration} onChange={e => setTimeoutData({...timeoutData, duration: e.target.value})} className="bg-neutral-900 border-neutral-600 rounded p-2 text-white" />
                        <input type="text" placeholder="Timeout Message" value={timeoutData.message} onChange={e => setTimeoutData({...timeoutData, message: e.target.value})} className="md:col-span-2 bg-neutral-900 border-neutral-600 rounded p-2 text-white" />
                         <button type="submit" className="md:col-span-1 bg-accent-red text-white font-bold py-2 px-4 rounded-lg">Issue Timeout</button>
                    </div>
                </form>
            </DevSection>

            <DevSection title="Content Rules & Moderation">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300">Max Images per Card</label>
                        <input type="number" name="maxImagesPerCard" value={localSettings.maxImagesPerCard} onChange={handleSettingsChange} className="mt-1 w-full bg-neutral-900 border-neutral-600 rounded p-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-300">Max Videos per Card</label>
                        <input type="number" name="maxVideosPerCard" value={localSettings.maxVideosPerCard} onChange={handleSettingsChange} className="mt-1 w-full bg-neutral-900 border-neutral-600 rounded p-2 text-white" />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="commentsEnabled" className="text-sm font-medium text-neutral-300">Enable Comments Globally</label>
                    <input type="checkbox" name="commentsEnabled" id="commentsEnabled" checked={localSettings.commentsEnabled} onChange={handleSettingsChange} className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-brand-primary focus:ring-brand-primary"/>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-700">
                     <h3 className="font-semibold text-white mb-2">Moderate Creator Content</h3>
                     <div className="flex gap-4 items-center">
                        <select value={selectedUserForModeration} onChange={e => setSelectedUserForModeration(e.target.value)} className="flex-grow bg-neutral-900 border-neutral-600 rounded p-2 text-white">
                            <option value="">Select a creator...</option>
                            {allUsers.filter(u => u.role === 'creator' || u.role === 'developer').map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
                        </select>
                         <button onClick={() => selectedUserForModeration && hideAllContentFromCreator(selectedUserForModeration)} disabled={!selectedUserForModeration} className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg disabled:opacity-50">Hide All</button>
                        <button onClick={() => selectedUserForModeration && deleteAllContentFromCreator(selectedUserForModeration)} disabled={!selectedUserForModeration} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">Delete All</button>
                    </div>
                    {selectedUserForModeration && (
                        <div className="mt-4 p-2 border border-neutral-700 rounded-lg max-h-48 overflow-y-auto">
                           <p className="text-sm text-neutral-300 mb-2">Found {moderatedUserContent.length} item(s) by this creator:</p>
                           <ul className="text-xs text-neutral-400">
                                {moderatedUserContent.map(item => <li key={item.id}>- {item.title} (ID: {item.id})</li>)}
                           </ul>
                        </div>
                    )}
                </div>
            </DevSection>

        </div>
    );
};

export default DeveloperPanel;
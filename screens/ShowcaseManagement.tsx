import React, { useState, useMemo } from 'react';
import { useCredits } from '../hooks/useCredits';
import { User } from '../types';

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
);

const ShowcaseManagement: React.FC = () => {
    const { allUsers, showcasedUserIds, setShowcasedUserIds } = useCredits();
    const [filters, setFilters] = useState({
        creator: true,
        user: true,
        developer: false,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (role: 'creator' | 'user' | 'developer') => {
        setFilters(prev => ({ ...prev, [role]: !prev[role] }));
    };
    
    const handleToggleUser = (userId: string) => {
        const isShowcased = showcasedUserIds.includes(userId);
        if (isShowcased) {
            setShowcasedUserIds(showcasedUserIds.filter(id => id !== userId));
        } else {
            setShowcasedUserIds([...showcasedUserIds, userId]);
        }
    };
    
    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            const matchesRole = (filters.creator && user.role === 'creator') ||
                                (filters.user && user.role === 'user') ||
                                (filters.developer && user.role === 'developer');
            const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  user.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRole && matchesSearch;
        });
    }, [allUsers, filters, searchTerm]);


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Showcase Management</h1>
                <p className="text-neutral-400">Select which users appear on the main home screen showcase.</p>
            </div>
            
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4 mb-4 pb-4 border-b border-neutral-700">
                    <div className="flex-1 flex items-center space-x-2 sm:space-x-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={filters.creator} onChange={() => handleFilterChange('creator')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-neutral-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-secondary"></div>
                            <span className="ml-3 text-sm font-medium text-neutral-300">Creators</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={filters.user} onChange={() => handleFilterChange('user')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-neutral-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            <span className="ml-3 text-sm font-medium text-neutral-300">Users</span>
                        </label>
                    </div>
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Search by username or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-neutral-700 border-neutral-600 rounded-md py-2 pl-10 pr-4 text-white w-full sm:w-64"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-white mb-4">Filtered Users ({filteredUsers.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between bg-neutral-700 p-3 rounded-md">
                            <div className="flex items-center">
                                <img src={user.profilePictureUrl} alt={user.username} className="w-10 h-10 rounded-full mr-4" />
                                <div>
                                    <p className="font-semibold text-white">{user.username}</p>
                                    <p className="text-xs text-neutral-400">
                                        <span className="capitalize">{user.role}</span> | ID: {user.id}
                                    </p>
                                </div>
                            </div>
                            <label className="inline-flex relative items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={showcasedUserIds.includes(user.id)}
                                    onChange={() => handleToggleUser(user.id)}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-neutral-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            
            {showcasedUserIds.length > 0 && (
                <div className="bg-neutral-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white">Currently Showcased ({showcasedUserIds.length})</h3>
                    <ul className="list-disc list-inside text-neutral-300 mt-2">
                        {showcasedUserIds.map(id => {
                            const user = allUsers.find(u => u.id === id);
                            return <li key={id}>{user?.username || id}</li>;
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ShowcaseManagement;
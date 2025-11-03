import React, { useMemo } from 'react';
import { ContentItem } from '../types';
import OnlyFansCard from './OnlyFansCard';
import { useCredits } from '../hooks/useCredits';

interface FeedProps {
    items: ContentItem[];
    onUnlockClick: (item: ContentItem) => void;
}

const Feed: React.FC<FeedProps> = ({ items, onUnlockClick }) => {
    const { devSettings, allUsers, currentUser, followUser, unfollowUser, setViewCreator } = useCredits();
    
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {items.map(item => {
                const creator = allUsers.find(u => u.id === item.creatorId);
                const isFollowing = currentUser?.following.includes(item.creatorId);

                return (
                    <div key={item.id} className="bg-neutral-800 rounded-lg overflow-hidden shadow-lg">
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <img src={creator?.profilePictureUrl} className="h-10 w-10 rounded-full" />
                                <button onClick={() => setViewCreator(creator!.id)} className="font-bold text-white hover:underline">{creator?.username}</button>
                            </div>
                            {currentUser && currentUser.id !== creator?.id && (
                                <button
                                    onClick={() => isFollowing ? unfollowUser(creator!.id) : followUser(creator!.id)}
                                    className={`px-3 py-1 text-sm font-semibold rounded-full ${isFollowing ? 'bg-neutral-700 text-neutral-300' : 'bg-brand-primary text-white'}`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </div>
                        <OnlyFansCard item={item} onCardClick={onUnlockClick} />
                        {devSettings.commentsEnabled && (
                            <div className="p-4 border-t border-neutral-700">
                                <div className="flex items-center">
                                    <input 
                                        type="text" 
                                        placeholder="Add a comment..."
                                        className="w-full bg-neutral-700 border-neutral-600 rounded-full py-2 px-4 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                    <button className="ml-2 p-2 rounded-full bg-brand-primary text-white hover:bg-brand-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Feed;
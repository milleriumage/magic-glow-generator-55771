import React, { useState } from 'react';
import { useCredits } from '../hooks/useCredits';
import { UserRole } from '../types';

interface ReactionBarProps {
    itemId: string;
    userReactions: Record<UserRole, string>;
}

const EMOJIS = ['😍', '😂', '😘', '😲', '❤️', '🙏', '🙈', '😁'];

const ReactionBar: React.FC<ReactionBarProps> = ({ itemId, userReactions }) => {
    const { addReaction } = useCredits();
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const totalReactions: number = Object.values(userReactions).filter(Boolean).length;

    const handleEmojiClick = (emoji: string) => {
        addReaction(itemId, emoji);
        setIsPickerOpen(false);
    };

    // FIX: Explicitly typed the initial value for the `reduce` accumulator as `Record<string, number>`.
    // This resolves an issue where TypeScript could not infer the accumulator's type,
    // causing an error when trying to index it and when sorting its values.
    const reactionCounts = Object.values(userReactions).reduce((acc, emoji) => {
        if (emoji) { // Only count non-empty reaction strings
            acc[emoji] = (acc[emoji] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="relative">
            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                    className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-700 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                    <span>Add Reaction</span>
                </button>
                {totalReactions > 0 && (
                    <button onClick={() => setIsDetailModalOpen(true)} className="text-sm text-neutral-400 hover:underline">
                        {totalReactions} reaction{totalReactions > 1 ? 's' : ''}
                    </button>
                )}
            </div>

            {isPickerOpen && (
                <div className="absolute bottom-full mb-2 bg-neutral-800 border border-neutral-700 rounded-full p-2 flex space-x-1 shadow-lg">
                    {EMOJIS.map(emoji => (
                        <button 
                            key={emoji}
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-2xl p-1 rounded-full hover:bg-neutral-600 transition-transform transform hover:scale-125"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
            
            {isDetailModalOpen && (
                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setIsDetailModalOpen(false)}>
                    <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-xs" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-white mb-4">All Reactions</h3>
                        <ul className="space-y-2">
                            {Object.entries(reactionCounts).sort(([, countA], [, countB]) => countB - countA).map(([emoji, count]) => (
                                <li key={emoji} className="flex justify-between items-center bg-neutral-700/50 rounded p-2">
                                    <span className="text-2xl">{emoji}</span>
                                    <span className="font-semibold text-white">{count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReactionBar;
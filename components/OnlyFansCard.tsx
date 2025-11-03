import React, { useState, useMemo } from 'react';
import { ContentItem } from '../types';
import ReactionBar from './ReactionBar';
import { useCredits } from '../hooks/useCredits';
import Notification from './Notification';

interface OnlyFansCardProps {
  item: ContentItem;
  onCardClick: (item: ContentItem) => void;
}

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const MediaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 mr-1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 mr-1"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>;
const HeartIcon: React.FC<{isLiked: boolean}> = ({isLiked}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
        className={`h-5 w-5 mr-1 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'fill-none'}`}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
);
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 mr-1"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>;

const OnlyFansCard: React.FC<OnlyFansCardProps> = ({ item, onCardClick }) => {
    const { unlockedContentIds, addLike, allUsers, setViewCreator, setTagFilter, currentUser, incrementShareCount } = useCredits();
    const [shareNotification, setShareNotification] = useState<string | null>(null);
    const isUnlocked = currentUser ? unlockedContentIds.includes(item.id) : false;
    
    const hasLiked = useMemo(() => currentUser ? item.likedBy.includes(currentUser.id) : false, [currentUser, item.likedBy]);
    const creator = useMemo(() => allUsers.find(u => u.id === item.creatorId), [allUsers, item.creatorId]);

    const handleCardInteraction = () => {
        onCardClick(item);
    };
    
    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        incrementShareCount(item.id);
        navigator.clipboard.writeText(`Check out this content: ${item.title}!`);
        setShareNotification('Link copied to clipboard!');
        setTimeout(() => setShareNotification(null), 2000);
    }

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) {
            alert("Please log in to like content.");
            return;
        }
        addLike(item.id);
    }
    
    // FIX: Explicitly typed the initial value for the `reduce` accumulator as `Record<string, number>`.
    // This resolves an issue where TypeScript could not infer the accumulator's type,
    // causing errors both when indexing it and when using its values in the subsequent `sort` function.
    const reactionCounts = useMemo(() => {
        if (!item.userReactions) {
            return {};
        }
        return Object.values(item.userReactions).reduce((acc, emoji) => {
            if (emoji) {
                acc[emoji] = (acc[emoji] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);
    }, [item.userReactions]);

    const sortedReactions = Object.entries(reactionCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);

    const blurAmount = isUnlocked ? 0 : item.blurLevel;
    const blurStyle = { filter: `blur(${blurAmount}px)` };

  return (
    <div onClick={handleCardInteraction} className="group relative overflow-hidden rounded-lg bg-neutral-800 shadow-lg aspect-[3/4] cursor-pointer">
      {shareNotification && <Notification message={shareNotification} type="success"/>}
      <img src={item.imageUrl} alt={item.title} style={blurStyle} className="w-full h-full object-cover transition-all duration-500 scale-110" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <div className="flex items-center text-sm space-x-4 mb-4 text-neutral-300">
                {item.mediaCount.images > 0 && <span className="flex items-center"><MediaIcon /> {item.mediaCount.images}</span>}
                {item.mediaCount.videos > 0 && <span className="flex items-center"><VideoIcon /> {item.mediaCount.videos}</span>}
            </div>
            <button 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light focus:ring-offset-neutral-800 transition-transform duration-200"
            >
                <EyeIcon />
                {currentUser ? `Unlock for ${item.price} credits` : 'View Content'}
            </button>
        </div>
      )}

      {isUnlocked && (
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-3 bg-black/50 backdrop-blur-sm rounded-full">
                    <EyeIcon />
                </div>
            </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-end">
              <div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <button onClick={(e) => { e.stopPropagation(); setViewCreator(item.creatorId); }} className="text-sm text-neutral-300 hover:underline">by {creator?.username}</button>
              </div>
               {sortedReactions.length > 0 && (
                <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    {sortedReactions.map(([emoji]) => (
                        <span key={emoji} className="text-lg">{emoji}</span>
                    ))}
                </div>
              )}
          </div>
           {item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                      <button key={tag} onClick={(e) => {e.stopPropagation(); setTagFilter(tag);}} className="text-xs bg-brand-secondary/50 text-brand-light px-2 py-1 rounded-full hover:bg-brand-secondary">
                          {tag}
                      </button>
                  ))}
              </div>
            )}
           <div className="mt-4 flex justify-between items-center">
              <ReactionBar itemId={item.id} userReactions={item.userReactions} />
               <div className="flex space-x-2">
                  <button onClick={handleLike} className="flex items-center bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-700 transition">
                      <HeartIcon isLiked={hasLiked} />
                      <span className="text-sm">{item.likedBy.length}</span>
                  </button>
                  <button onClick={handleShare} className="flex items-center bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-700 transition">
                      <ShareIcon />
                      <span className="text-sm">{item.sharedBy.length}</span>
                  </button>
              </div>
           </div>
      </div>
    </div>
  );
};

export default OnlyFansCard;
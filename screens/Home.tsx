
import React, { useState, useMemo } from 'react';
import { type Screen, type ContentItem } from '../types';
import { useCredits } from '../hooks/useCredits';
import OnlyFansCard from '../components/OnlyFansCard';
import ConfirmPurchaseModal from '../components/ConfirmPurchaseModal';
import Notification from '../components/Notification';
import Feed from '../components/Feed';
import ViewContentModal from '../components/ViewContentModal';

interface HomeProps {
  navigate: (screen: Screen) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  const { contentItems, unlockedContentIds, currentUser, activeTagFilter, setTagFilter, viewingCreatorId, setViewCreator, allUsers, showcasedUserIds } = useCredits();
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isViewContentModalOpen, setIsViewContentModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'showcase' | 'feed' | 'following'>('showcase');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCardClick = (item: ContentItem) => {
    setSelectedItem(item);
    if (!currentUser) { // Guest user
        setIsPurchaseModalOpen(true);
        return;
    }
    if (unlockedContentIds.includes(item.id)) {
      setIsViewContentModalOpen(true);
    } else {
      setIsPurchaseModalOpen(true);
    }
  };

  const handlePurchaseSuccess = () => {
    setNotification({ message: 'Content unlocked successfully!', type: 'success' });
    setIsPurchaseModalOpen(false);
    setIsViewContentModalOpen(true); 
  };

  const handlePurchaseError = (error: string) => {
    setNotification({ message: error, type: 'error' });
    setIsPurchaseModalOpen(false);
    setSelectedItem(null);
    setTimeout(() => setNotification(null), 3000);
  };
  
  const closeAllModals = () => {
    setIsPurchaseModalOpen(false);
    setIsViewContentModalOpen(false);
    setSelectedItem(null);
  }
  
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setTagFilter(searchTerm);
  }

  const viewingCreator = useMemo(() => {
    if (!viewingCreatorId) return null;
    return allUsers.find(u => u.id === viewingCreatorId);
  }, [viewingCreatorId, allUsers]);

  const filteredContent = useMemo(() => {
    let items = contentItems;
    if (viewingCreatorId) {
        return items.filter(item => item.creatorId === viewingCreatorId);
    }
    if (activeTagFilter) {
        return items.filter(item => item.tags.includes(activeTagFilter.toLowerCase()));
    }
    if (activeTab === 'showcase' && showcasedUserIds.length > 0) {
        return items.filter(item => showcasedUserIds.includes(item.creatorId));
    }
    if (activeTab === 'following' && currentUser) {
        return items.filter(item => currentUser.following.includes(item.creatorId));
    }
    return items;
  }, [contentItems, activeTab, currentUser, activeTagFilter, viewingCreatorId, showcasedUserIds]);


  const TabButton: React.FC<{tab: 'showcase' | 'feed' | 'following', label: string, disabled?: boolean}> = ({tab, label, disabled}) => (
    <button
        onClick={() => {
            setViewCreator(null);
            setActiveTab(tab);
        }}
        disabled={disabled}
        className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors disabled:cursor-not-allowed disabled:text-neutral-600 ${activeTab === tab && !viewingCreatorId ? 'border-b-2 border-brand-primary text-white' : 'text-neutral-400 hover:text-white'}`}
    >
        {label}
    </button>
  );

  return (
    <div className="space-y-8">
      {notification && <Notification message={notification.message} type={notification.type} />}
      
      {viewingCreator ? (
        <div>
            <button onClick={() => setViewCreator(null)} className="text-sm text-brand-light hover:underline mb-2">&larr; Back to Home</button>
            <div className="flex items-center space-x-4">
                <img src={viewingCreator.profilePictureUrl} className="h-16 w-16 rounded-full"/>
                <div>
                    <h1 className="text-3xl font-bold text-white">{viewingCreator.username}'s Showcase</h1>
                    <p className="text-neutral-300">Browse all content from this creator.</p>
                </div>
            </div>
        </div>
      ) : activeTagFilter ? (
        <div>
             <button onClick={() => setTagFilter(null)} className="text-sm text-brand-light hover:underline mb-2">&larr; Clear Filter</button>
            <h1 className="text-3xl font-bold text-white">Showing content for tag: <span className="text-brand-primary">{activeTagFilter}</span></h1>
        </div>
      ) : (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Exclusive Content</h1>
            <p className="text-neutral-300">Discover new creators and unlock instant access.</p>
        </div>
      )}


       <div className="border-b border-neutral-700 flex justify-between items-center">
        {!viewingCreatorId && (
            <div className="flex space-x-4">
                <TabButton tab="showcase" label="Showcase" />
                <TabButton tab="feed" label="Feed" />
                <TabButton tab="following" label="Following" disabled={!currentUser} />
            </div>
        )}
        <form onSubmit={handleSearch} className="flex items-center">
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by tag... (#art)"
                className="bg-neutral-800 border border-neutral-700 rounded-l-full py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            <button type="submit" className="bg-brand-primary text-white p-2 rounded-r-full hover:bg-brand-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
        </form>
      </div>

      {(activeTab === 'showcase' || viewingCreatorId) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map(item => (
            <OnlyFansCard key={item.id} item={item} onCardClick={handleCardClick} />
          ))}
        </div>
      )}

      {(activeTab === 'feed' || activeTab === 'following') && !viewingCreatorId && (
        <Feed items={filteredContent} onUnlockClick={handleCardClick} />
      )}

      {isPurchaseModalOpen && selectedItem && (
        <ConfirmPurchaseModal
          item={selectedItem}
          onClose={closeAllModals}
          onConfirm={handlePurchaseSuccess}
          onError={handlePurchaseError}
        />
      )}

      {isViewContentModalOpen && selectedItem && (
        <ViewContentModal 
            item={selectedItem}
            onClose={closeAllModals}
        />
      )}
    </div>
  );
};

export default Home;
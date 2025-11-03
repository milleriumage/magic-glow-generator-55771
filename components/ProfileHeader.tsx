import React, { useState } from 'react';
import { useCredits } from '../hooks/useCredits';
import FollowListModal from './FollowListModal';

const ProfileHeader: React.FC = () => {
    const { currentUser } = useCredits();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<'followers' | 'following'>('followers');

    if (!currentUser) return null;

    const openModal = (type: 'followers' | 'following') => {
        setModalContent(type);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex flex-col items-center text-center">
                <img src={currentUser.profilePictureUrl} alt={currentUser.username} className="w-20 h-20 rounded-full border-2 border-brand-primary mb-2" />
                <h2 className="font-bold text-lg text-white">{currentUser.username}</h2>
                <div className="flex space-x-4 mt-2">
                    <button onClick={() => openModal('followers')} className="text-center text-neutral-400 hover:text-white">
                        <p className="font-bold text-white">{currentUser.followers.length}</p>
                        <p className="text-xs">Followers</p>
                    </button>
                    <button onClick={() => openModal('following')} className="text-center text-neutral-400 hover:text-white">
                        <p className="font-bold text-white">{currentUser.following.length}</p>
                        <p className="text-xs">Following</p>
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <FollowListModal
                    title={modalContent === 'followers' ? 'Followers' : 'Following'}
                    userIds={modalContent === 'followers' ? currentUser.followers : currentUser.following}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default ProfileHeader;

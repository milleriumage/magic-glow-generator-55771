import React from 'react';
import { useCredits } from '../hooks/useCredits';

interface FollowListModalProps {
    title: string;
    // FIX: Changed userIds type from UserRole[] to string[] to match the user ID format.
    userIds: string[];
    onClose: () => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ title, userIds, onClose }) => {
    const { allUsers, setViewCreator } = useCredits();

    const users = allUsers.filter(user => userIds.includes(user.id));

    // FIX: Changed userId parameter type from UserRole to string to match the user.id type.
    const handleUserClick = (userId: string) => {
        setViewCreator(userId);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-neutral-800 rounded-xl shadow-2xl p-6 w-full max-w-xs transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white text-2xl">&times;</button>
                </div>
                {users.length > 0 ? (
                    <ul className="space-y-3 max-h-80 overflow-y-auto">
                        {users.map(user => (
                            <li key={user.id}>
                                <button onClick={() => handleUserClick(user.id)} className="w-full flex items-center p-2 rounded-lg hover:bg-neutral-700">
                                    <img src={user.profilePictureUrl} alt={user.username} className="w-10 h-10 rounded-full mr-3" />
                                    <span className="font-semibold text-white">{user.username}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-neutral-400 text-center py-4">No users to show.</p>
                )}
            </div>
        </div>
    );
};

export default FollowListModal;
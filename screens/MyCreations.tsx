import React, { useState, useEffect } from 'react';
import { useCredits } from '../hooks/useCredits';
import { ContentItem } from '../types';
import Notification from '../components/Notification';

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 mr-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;

const MyCreations: React.FC = () => {
    const { contentItems, deleteContent, currentUser } = useCredits();
    const [myItems, setMyItems] = useState<ContentItem[]>([]);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    useEffect(() => {
        if (currentUser) {
            setMyItems(contentItems.filter(item => item.creatorId === currentUser.id));
        }
    }, [contentItems, currentUser]);

    const handleDelete = (itemId: string) => {
        const success = deleteContent(itemId);
        if (success) {
            setNotification({message: 'Content deleted successfully.', type: 'success'});
        } else {
            setNotification({message: 'Deletion failed. Content must be over 24 hours old.', type: 'error'});
        }
        setTimeout(() => setNotification(null), 3000);
    }

    const isDeletable = (item: ContentItem) => {
        const twentyFourHours = 24 * 60 * 60 * 1000;
        return (Date.now() - new Date(item.createdAt).getTime()) > twentyFourHours;
    }

    return (
        <div className="max-w-4xl mx-auto">
            {notification && <Notification message={notification.message} type={notification.type} />}
            <h1 className="text-3xl font-bold text-white">My Creations</h1>
            <p className="text-neutral-400 mb-6">Manage the content you have created.</p>
            <div className="bg-neutral-800 rounded-lg shadow-lg">
                {myItems.length > 0 ? (
                <ul className="divide-y divide-neutral-700">
                    {myItems.map((item: ContentItem) => (
                    <li key={item.id} className="p-4 flex justify-between items-center hover:bg-neutral-700/50">
                        <div className="flex items-center">
                            <img src={item.imageUrl} alt={item.title} className="h-16 w-16 rounded-md object-cover mr-4"/>
                            <div>
                                <p className="font-semibold text-white">{item.title}</p>
                                <p className="text-sm text-neutral-400">
                                    {item.price} credits - Created on {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(item.id)}
                            disabled={!isDeletable(item)}
                            className="flex items-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed hover:bg-red-500"
                            title={isDeletable(item) ? "Delete this card" : "You can delete content 24 hours after creation"}
                        >
                            <TrashIcon/> Delete
                        </button>
                    </li>
                    ))}
                </ul>
                ) : (
                <div className="text-center py-12 px-6">
                    <p className="text-neutral-400">You haven't created any content yet.</p>
                </div>
                )}
            </div>
        </div>
    );
};

export default MyCreations;
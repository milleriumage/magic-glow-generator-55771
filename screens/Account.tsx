import React, { useState, useEffect } from 'react';
import { useCredits } from '../hooks/useCredits';
import { User } from '../types';
import Notification from '../components/Notification';

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const Account: React.FC = () => {
    const { currentUser, updateUserProfile } = useCredits();
    const [formData, setFormData] = useState<Partial<User>>(currentUser || {});
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        setFormData(currentUser || {});
    }, [currentUser]);
    
    if (!currentUser) {
        return <div>Loading...</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'vitrineSlug') {
            setFormData({ ...formData, [name]: slugify(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePictureChange = () => {
        const newPic = `https://i.pravatar.cc/150?u=${Date.now()}`;
        updateUserProfile({ profilePictureUrl: newPic });
        setNotification('Profile picture updated!');
        setTimeout(() => setNotification(null), 2000);
    }
    
    const handleMediaUpload = () => {
        alert("This would open a media upload dialog for your profile!");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile(formData);
        setNotification('Profile saved successfully!');
        setTimeout(() => setNotification(null), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {notification && <Notification message={notification} type="success" />}
            <h1 className="text-3xl font-bold text-white mb-6">My Account</h1>
            <div className="bg-neutral-800 rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <img src={currentUser.profilePictureUrl} alt="Profile" className="w-24 h-24 rounded-full" />
                        <div className="flex flex-col space-y-2">
                            <button type="button" onClick={handlePictureChange} className="bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg">Change Picture</button>
                             <button type="button" onClick={handleMediaUpload} className="bg-neutral-700 text-white font-semibold py-2 px-4 rounded-lg">Upload Media</button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-neutral-300">Username</label>
                        <input type="text" name="username" id="username" value={formData.username || ''} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md py-2 px-3 text-white" />
                    </div>
                     <div>
                        <label htmlFor="vitrineSlug" className="block text-sm font-medium text-neutral-300">Vitrine Username (URL)</label>
                        <input type="text" name="vitrineSlug" id="vitrineSlug" value={formData.vitrineSlug || ''} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md py-2 px-3 text-white" />
                        <p className="text-xs text-neutral-400 mt-1">Your public URL: /vitrine/{formData.vitrineSlug}</p>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-300">Email</label>
                        <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full bg-neutral-700 border-neutral-600 rounded-md py-2 px-3 text-white" />
                    </div>
                     {/* Add more fields as needed, e.g., age, gender, phone */}

                    <div className="pt-2">
                         <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-brand-primary/90">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Account;
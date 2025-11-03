
import React, { useState } from 'react';
import { useCredits } from '../hooks/useCredits';
import { TransactionType } from '../types';
import Notification from '../components/Notification';

const GENERATION_COST = 50;

const initialPoses = [
    'Full frontal view, hands on hips',
    'Slightly turned, 3/4 view',
    'Side profile view',
    'Jumping in the air, mid-action shot',
    'Walking towards camera',
    'Leaning against a wall'
];

const initialWardrobe = [
    { id: 'w1', name: 'Graphic T-shirt', imageUrl: 'https://i.imgur.com/vDA0k2v.png' },
    { id: 'w2', name: 'Black T-shirt', imageUrl: 'https://i.imgur.com/Qp1tQ2H.png' },
];

const initialBaseModel = { id: 'base', name: 'Base Model', imageUrl: 'https://i.imgur.com/i4ATsD5.png' };

const OutfitGenerator: React.FC = () => {
    const { balance, addCredits } = useCredits();

    const [mainImage, setMainImage] = useState(initialBaseModel.imageUrl);
    const [selectedPose, setSelectedPose] = useState(initialPoses[3]);
    const [outfitStack, setOutfitStack] = useState([initialBaseModel]);
    const [wardrobe, setWardrobe] = useState(initialWardrobe);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleGenerate = () => {
        if (balance < GENERATION_COST) {
            setNotification({ message: `Insufficient credits. You need ${GENERATION_COST} credits.`, type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }
        setIsLoading(true);
        addCredits(-GENERATION_COST, `Outfit generation for pose: ${selectedPose}`, TransactionType.PURCHASE);

        setTimeout(() => {
            const newOutfit = {
                id: `outfit_${Date.now()}`,
                name: `Generated Outfit`,
                imageUrl: `https://picsum.photos/seed/outfit${Date.now()}/600/800`
            };
            setOutfitStack(prev => [...prev, newOutfit]);
            setMainImage(newOutfit.imageUrl);
            setIsLoading(false);
            setNotification({ message: 'Outfit generated successfully!', type: 'success' });
            setTimeout(() => setNotification(null), 2000);
        }, 2000);
    };

    const handleStartOver = () => {
        setMainImage(initialBaseModel.imageUrl);
        setOutfitStack([initialBaseModel]);
        setSelectedPose(initialPoses[3]);
    };

    const handleDownload = () => {
        alert('Simulating download of a .zip file with your generated outfits!');
    };
    
    const handleUpload = () => {
        alert('This would open a file dialog to upload new wardrobe items.');
    }
    
    const changePose = (direction: 'prev' | 'next') => {
        const currentIndex = initialPoses.indexOf(selectedPose);
        if(direction === 'next') {
            const nextIndex = (currentIndex + 1) % initialPoses.length;
            setSelectedPose(initialPoses[nextIndex]);
        } else {
            const prevIndex = (currentIndex - 1 + initialPoses.length) % initialPoses.length;
            setSelectedPose(initialPoses[prevIndex]);
        }
    }

    return (
        <div className="flex h-full bg-neutral-100 text-neutral-900 rounded-lg">
            {notification && <Notification message={notification.message} type={notification.type} />}
            {/* Main Content */}
            <div className="flex-1 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handleStartOver} className="text-sm bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold py-2 px-4 rounded-lg">Start Over</button>
                    <button onClick={handleGenerate} disabled={isLoading} className="text-sm bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
                <div className="flex-1 relative flex items-center justify-center bg-neutral-200 rounded-lg">
                    {isLoading && (
                         <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                            <svg className="animate-spin h-8 w-8 text-neutral-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                    <img src={mainImage} alt="Generated Outfit" className="max-h-full max-w-full object-contain rounded-lg" />
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg w-3/4">
                       <div className="flex justify-between items-center text-sm font-semibold">
                            <button onClick={() => changePose('prev')} className="p-2 rounded-full hover:bg-neutral-200">&lt;</button>
                            <p className="text-center">{selectedPose}</p>
                            <button onClick={() => changePose('next')} className="p-2 rounded-full hover:bg-neutral-200">&gt;</button>
                       </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-80 bg-white border-l border-neutral-200 flex flex-col p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">Outfit Studio</h2>
                    <button onClick={handleDownload} className="text-sm bg-accent-green hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">Download</button>
                </div>
                
                {/* Outfit Stack */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Outfit Stack</h3>
                    <div className="space-y-2 border border-neutral-200 rounded-lg p-2 max-h-48 overflow-y-auto">
                        {outfitStack.map((item, index) => (
                            <div key={item.id} className="flex items-center p-2 rounded-md bg-neutral-100">
                                <span className="text-sm font-bold text-neutral-500 mr-3">{index + 1}</span>
                                <p className="text-sm font-medium flex-1">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wardrobe */}
                <div>
                    <h3 className="font-semibold mb-2">Wardrobe</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {wardrobe.map(item => (
                            <div key={item.id} className="aspect-square bg-neutral-200 rounded-lg flex items-center justify-center p-1 cursor-pointer hover:ring-2 ring-brand-primary">
                                <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain"/>
                            </div>
                        ))}
                         <button onClick={handleUpload} className="aspect-square border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center text-neutral-500 hover:bg-neutral-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <span className="text-xs font-semibold">Upload</span>
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default OutfitGenerator;

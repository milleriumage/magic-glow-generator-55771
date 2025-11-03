
import React, { useState } from 'react';
import DevSection from '../components/DevSection';
import ConfirmPurchaseModal from '../components/ConfirmPurchaseModal';
import { INITIAL_CONTENT_ITEMS } from '../constants';
import CancelSubscriptionModal from '../components/CancelSubscriptionModal';
import { useCredits } from '../hooks/useCredits';
import GeminiModal from '../components/GeminiModal';
import Sidebar from '../components/Sidebar';

const UXKit: React.FC = () => {
    const { userSubscription } = useCredits(); // Needed for CancelSubscriptionModal
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
    
    const colors = {
      'brand-primary': '#4F46E5', 'brand-secondary': '#7C3AED', 'brand-light': '#A78BFA',
      'neutral-900': '#111827', 'neutral-800': '#1F2937', 'neutral-700': '#374151',
      'neutral-600': '#4B5563', 'neutral-300': '#D1D5DB', 'neutral-100': '#F3F4F6',
      'accent-gold': '#FBBF24', 'accent-green': '#10B981', 'accent-red': '#EF4444',
    };

    const ColorSwatch: React.FC<{ name: string, hex: string }> = ({ name, hex }) => (
        <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-lg shadow-md mb-2" style={{ backgroundColor: hex }}></div>
            <p className="text-sm font-mono">{name}</p>
            <p className="text-xs text-neutral-400 font-mono">{hex}</p>
        </div>
    );

    // Fix: Added an optional `onClick` prop to the Button component to handle click events.
    const Button: React.FC<{ className: string, children: React.ReactNode, onClick?: () => void }> = ({ className, children, onClick }) => (
        <button onClick={onClick} className={`font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 ${className}`}>{children}</button>
    );

    return (
        <div className="space-y-8">
            {isPurchaseModalOpen && (
                <ConfirmPurchaseModal 
                    item={INITIAL_CONTENT_ITEMS[0]} 
                    onClose={() => setIsPurchaseModalOpen(false)} 
                    onConfirm={() => setIsPurchaseModalOpen(false)}
                    onError={() => setIsPurchaseModalOpen(false)}
                />
            )}
             {isCancelModalOpen && userSubscription && (
                <CancelSubscriptionModal onClose={() => setIsCancelModalOpen(false)} onSuccess={() => setIsCancelModalOpen(false)} />
             )}
            {isGeminiModalOpen && <GeminiModal mode="improve" onClose={() => setIsGeminiModalOpen(false)} />}
            <div>
                <h1 className="text-3xl font-bold text-white">UX Kit & Component Inventory</h1>
                <p className="text-neutral-400">A visual guide to all UI components in the application.</p>
            </div>

            <DevSection title="Colors">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                    {Object.entries(colors).map(([name, hex]) => <ColorSwatch key={name} name={name} hex={hex} />)}
                </div>
            </DevSection>

             <DevSection title="Typography">
                <h1 className="text-4xl font-extrabold text-white">Heading 1 (4xl, extrabold)</h1>
                <h2 className="text-3xl font-bold text-white">Heading 2 (3xl, bold)</h2>
                <h3 className="text-xl font-semibold text-white">Heading 3 (xl, semibold)</h3>
                <p className="text-neutral-100">This is a standard paragraph for body text.</p>
                <p className="text-neutral-300">This is a lighter paragraph for supplementary text.</p>
                <p className="text-sm text-neutral-400">This is small text for captions or labels.</p>
            </DevSection>

            <DevSection title="Buttons">
                <div className="flex flex-wrap gap-4 items-center">
                    <Button className="bg-brand-primary text-white">Primary</Button>
                    <Button className="bg-brand-secondary text-white">Secondary</Button>
                    <Button className="bg-accent-red text-white">Destructive</Button>
                    <Button className="bg-accent-green text-white">Success</Button>
                    <Button className="bg-neutral-700 text-white">Neutral</Button>
                    <Button className="bg-neutral-800 border border-neutral-600 text-neutral-300">Outlined</Button>
                </div>
            </DevSection>
            
            <DevSection title="Interactive Components">
                <h3 className="text-lg font-semibold text-white mb-2">Modals</h3>
                <div className="flex flex-wrap gap-4">
                     <Button onClick={() => setIsPurchaseModalOpen(true)} className="bg-neutral-700 text-white">Open Purchase Modal</Button>
                     {userSubscription && <Button onClick={() => setIsCancelModalOpen(true)} className="bg-neutral-700 text-white">Open Cancel Modal</Button>}
                     <Button onClick={() => setIsGeminiModalOpen(true)} className="bg-neutral-700 text-white">Open Gemini Modal</Button>
                </div>
            </DevSection>

             <DevSection title="Layout Components">
                <h3 className="text-lg font-semibold text-white mb-2">Sidebar</h3>
                 <div className="h-96 w-64">
                    <p className="text-sm text-neutral-400 mb-2">This is a live preview of the sidebar component.</p>
                    <div className="relative h-full w-full overflow-hidden rounded-lg border border-neutral-700">
                       <Sidebar />
                    </div>
                </div>
            </DevSection>
        </div>
    );
};

export default UXKit;

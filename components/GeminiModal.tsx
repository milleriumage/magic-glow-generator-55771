import React, { useState } from 'react';

interface GeminiModalProps {
  mode: 'improve' | 'analyze';
  onClose: () => void;
}

const GeminiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.13 2.69a2 2 0 0 0-1.05.51l-6.85 6.85a2 2 0 0 0 0 2.82l6.85 6.85a2 2 0 0 0 2.82 0l6.85-6.85a2 2 0 0 0 0-2.82l-6.85-6.85a2 2 0 0 0-1.77-.51z"/><path d="m14.28 15.6-3.3-3.3a4.24 4.24 0 0 0 0-6l3.3-3.3"/></svg>;

const ImprovementResponse = () => (
    <div className="prose prose-invert prose-sm text-neutral-300 space-y-2">
        <h4>Platform Improvement Suggestions:</h4>
        <ol>
            <li><strong>Gamification:</strong> Introduce achievement badges for creators (e.g., "100 Followers," "Top Seller") and users (e.g., "Power Buyer"). This increases engagement and provides social proof.</li>
            <li><strong>Creator Tiers:</strong> Implement a tiered subscription model for fans to support creators at different levels, offering varied rewards like exclusive DMs, custom content, or behind-the-scenes access.</li>
            <li><strong>Live Streaming Integration:</strong> Allow creators to host ticketed live stream events. Integrate a tipping feature using credits during streams to boost creator earnings and fan interaction.</li>
            <li><strong>AI-Powered Content Discovery:</strong> Use a recommendation engine to suggest creators to users based on their purchase history and liking patterns, improving discoverability and sales.</li>
        </ol>
    </div>
);

const AnalysisResponse = () => (
    <div className="prose prose-invert prose-sm text-neutral-300 space-y-3">
        <h4>Supabase Schema Analysis:</h4>
        <p>Based on the current application flow, the following Supabase tables are recommended for a robust backend:</p>
        <ul>
            <li><code>profiles</code>: Stores user data (auth.users extension), profile picture URL, username, balances. RLS policies for user-specific access.</li>
            <li><code>content_items</code>: Stores all creator posts, including price, media URLs (Supabase Storage), and creator ID (foreign key to profiles).</li>
            <li><code>transactions</code>: Logs all credit-based transactions (purchases, rewards, etc.) with foreign keys to profiles and content_items.</li>
            <li><code>subscriptions</code>: Manages user subscription status, linking profiles to subscription plans.</li>
            <li><code>followers</code>: A join table to manage the many-to-many relationship of followers and following.</li>
        </ul>
        <div className="p-2 border border-green-500/50 bg-green-900/50 rounded-md">
            <strong>Check-up Result:</strong> <span className="text-green-400">OK.</span> The simulated frontend state aligns well with this proposed schema. No critical tables appear to be missing for core functionality.
        </div>
    </div>
);


const GeminiModal: React.FC<GeminiModalProps> = ({ mode, onClose }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<React.ReactNode | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const title = mode === 'improve' ? 'Improve Platform with AI' : 'Analyze Project with AI';
    const placeholder = mode === 'improve' ? 'e.g., What new feature would increase user retention?' : 'e.g., Analyze my project for database requirements.';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call to Gemini
        setTimeout(() => {
            setResponse(mode === 'improve' ? <ImprovementResponse /> : <AnalysisResponse />);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-neutral-800 rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex items-center mb-4">
                    <GeminiIcon />
                    <h2 className="text-xl font-bold text-white ml-3">{title}</h2>
                </div>
                
                <div className="bg-neutral-900 rounded-lg p-4 min-h-[200px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                             <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : response ? (
                       response
                    ) : (
                        <p className="text-neutral-400">Ask a question to get an AI-powered analysis.</p>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="flex-grow bg-neutral-700 border-neutral-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg">
                        Ask
                    </button>
                </form>

            </div>
        </div>
    );
};

export default GeminiModal;
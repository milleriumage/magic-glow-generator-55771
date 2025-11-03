
import React, { useState, useRef, useEffect } from 'react';
import { useCredits } from '../hooks/useCredits';
import OnlyFansCard from '../components/OnlyFansCard';

const DemoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/></svg>
);


const Login: React.FC = () => {
  const { login, allUsers, contentItems } = useCredits();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  const showcaseItems = contentItems.slice(0, 4);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate credentials.
    // Here, we log in as the main creator account.
    const creatorUser = allUsers.find(u => u.role === 'creator');
    if (creatorUser) {
        login(creatorUser.id);
    } else {
        alert('Default creator account not found!');
    }
  };
  
  // Close demo dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (demoRef.current && !demoRef.current.contains(event.target as Node)) {
                setIsDemoOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [demoRef]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-4">
        <div className="w-full max-w-md relative">
            <div className="absolute top-4 right-4 z-10" ref={demoRef}>
                <button 
                    onClick={() => setIsDemoOpen(!isDemoOpen)}
                    className="flex items-center p-2 bg-neutral-700 text-white rounded-full hover:bg-neutral-600"
                    aria-label="Access Demo Accounts"
                >
                    <DemoIcon />
                </button>
                {isDemoOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl animate-fade-in-down">
                        <div className="p-2">
                             <p className="text-xs text-neutral-400 px-2 pb-1">Select a demo profile to login:</p>
                            {allUsers.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => {
                                        login(user.id)
                                        setIsDemoOpen(false);
                                    }}
                                    className="w-full flex items-center p-2 text-left rounded-md hover:bg-neutral-700 transition-colors"
                                >
                                    <img src={user.profilePictureUrl} alt={user.username} className="w-9 h-9 rounded-full mr-3" />
                                    <div>
                                        <p className="font-semibold text-sm text-white">{user.username}</p>
                                        <p className="text-xs text-neutral-400 capitalize">{user.role}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 space-y-6 bg-neutral-800 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white tracking-wider">
                        FUN<span className="text-brand-primary">FANS</span>
                    </h1>
                    <p className="mt-2 text-neutral-400">Your exclusive content hub.</p>
                </div>
                
                <div className="flex border-b border-neutral-700">
                    <button 
                        onClick={() => setActiveTab('login')}
                        className={`w-1/2 py-3 font-semibold text-center transition-colors ${activeTab === 'login' ? 'text-white border-b-2 border-brand-primary' : 'text-neutral-400 hover:text-white'}`}
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => setActiveTab('register')}
                        className={`w-1/2 py-3 font-semibold text-center transition-colors ${activeTab === 'register' ? 'text-white border-b-2 border-brand-primary' : 'text-neutral-400 hover:text-white'}`}
                    >
                        Register
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="text-sm font-medium text-neutral-300" htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="you@example.com" required className="w-full mt-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-neutral-300" htmlFor="password">Password</label>
                            <a href="#" className="text-xs text-neutral-400 hover:text-brand-light">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
                                Forgot password?
                            </a>
                        </div>
                        <input id="password" type="password" placeholder="••••••••" required className="w-full mt-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    </div>
                    <button type="submit" className="w-full py-3 font-bold text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 transition-colors">
                        {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

            </div>
        </div>
        
        <div className="mt-12 w-full max-w-5xl">
            <h2 className="text-center text-xl font-bold text-white mb-4">Discover a World of Content</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pointer-events-none">
                 {showcaseItems.map(item => (
                    <div key={item.id} className="opacity-70">
                        <OnlyFansCard item={{...item, blurLevel: 8}} onCardClick={() => {}} />
                    </div>
                 ))}
             </div>
        </div>
    </div>
  );
};

export default Login;
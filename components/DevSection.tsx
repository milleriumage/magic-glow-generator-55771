
import React, { useState, ReactNode } from 'react';

interface DevSectionProps {
    title: string;
    children: ReactNode;
}

const ChevronIcon: React.FC<{isOpen: boolean}> = ({isOpen}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
)

const DevSection: React.FC<DevSectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-neutral-800 rounded-lg shadow-lg">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-neutral-700/50 rounded-t-lg"
            >
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <ChevronIcon isOpen={isOpen} />
            </button>
            {isOpen && (
                <div className="p-4 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export default DevSection;


import React, { useState, useEffect } from 'react';

interface TimeoutScreenProps {
  message: string;
  endTime: number;
}

const TimeoutScreen: React.FC<TimeoutScreenProps> = ({ message, endTime }) => {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        clearInterval(timer);
        window.location.reload(); // Refresh to exit timeout state
      }
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-white text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Access Restricted</h1>
      <p className="text-lg text-neutral-300 max-w-md mb-8">{message}</p>
      <div className="bg-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400 mb-2">You can access the app again in:</p>
        <p className="text-5xl font-mono font-bold text-accent-red">
          {formatTime(timeLeft)}
        </p>
      </div>
    </div>
  );
};

export default TimeoutScreen;

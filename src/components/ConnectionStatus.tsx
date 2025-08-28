import React from 'react';
import { useSocket } from '../contexts/SocketContext';

export const ConnectionStatus: React.FC = () => {
  const { isConnected } = useSocket();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg text-white text-sm font-medium ${
        isConnected ? 'bg-green-500' : 'bg-red-500'
      }`}>
        {isConnected ? 'Connected to Backend' : 'Disconnected from Backend'}
      </div>
    </div>
  );
};

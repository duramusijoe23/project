import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { socketService } from '../services/socketService';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinMonitoringRoom: () => void;
  leaveMonitoringRoom: () => void;
  startCapture: (interfaceName: string) => void;
  stopCapture: () => void;
  getInterfaces: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = socketService.connect();
    setSocket(socketInstance);

    // Set up event listeners
    socketInstance.on('connect', () => {
      console.log('Socket connected in context');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected in context');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error: Error) => {
      // Reduce console noise - the socketService already handles logging
      setIsConnected(false);
    });

    socketInstance.on('reconnect_failed', () => {
      console.info('Socket reconnection failed - continuing with offline mode');
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('connect_error');
      socketInstance.off('reconnect_failed');
      socketService.disconnect();
    };
  }, []);

  const joinMonitoringRoom = () => {
    socketService.joinMonitoringRoom();
  };

  const leaveMonitoringRoom = () => {
    socketService.leaveMonitoringRoom();
  };

  const startCapture = (interfaceName: string) => {
    socketService.startCapture(interfaceName);
  };

  const stopCapture = () => {
    socketService.stopCapture();
  };

  const getInterfaces = () => {
    socketService.getInterfaces();
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinMonitoringRoom,
    leaveMonitoringRoom,
    startCapture,
    stopCapture,
    getInterfaces,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

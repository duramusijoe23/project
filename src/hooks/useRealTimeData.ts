import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface NetworkMetrics {
  bandwidth: number;
  latency: number;
  packetLoss: number;
  activeDevices: number;
  throughput: number;
  uptime: number;
}

export const useRealTimeData = () => {
  const { socket, isConnected, joinMonitoringRoom } = useSocket();
  // Fallback function to generate simulated data when backend is not available
  const generateSimulatedMetrics = (): SystemMetrics => ({
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 100),
    network: Math.floor(Math.random() * 100),
    disk: Math.floor(Math.random() * 100),
    timestamp: Date.now(),
  });

  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);

  useEffect(() => {
    if (!socket) {
      // If no socket connection, use simulated data
      const interval = setInterval(() => {
        setMetrics(generateSimulatedMetrics());
      }, 5000);

      // Set initial data immediately
      setMetrics(generateSimulatedMetrics());

      return () => clearInterval(interval);
    }
      joinMonitoringRoom();
    if (isConnected) {
      // Listen for real-time system metrics from backend
      socket.on('system-metrics', (data: SystemMetrics) => {
        setMetrics(data);
      });
    } else {
      // Use simulated data when not connected
      const interval = setInterval(() => {
        setMetrics(generateSimulatedMetrics());
      }, 5000);

      // Set initial data immediately
      setMetrics(generateSimulatedMetrics());

      return () => clearInterval(interval);
    }

      return () => {
        socket.off('system-metrics');
      if (socket) {
        socket.off('system-metrics');
      }
    }
  }, [socket, isConnected]);

  return { metrics, isConnected };
};

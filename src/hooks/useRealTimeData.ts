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
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);

  useEffect(() => {
    if (!socket) return;

      joinMonitoringRoom();

    // Listen for real-time system metrics from backend
    socket.on('system-metrics', (data: NetworkMetrics) => {
      setMetrics(data);
    });

      return () => {
        socket.off('system-metrics');
    }
  }, [socket, isConnected]);

  return { metrics, isConnected };
};

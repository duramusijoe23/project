import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Socket {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    this.socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to backend server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from backend server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Join monitoring room for real-time updates
  joinMonitoringRoom(): void {
    if (this.socket) {
      this.socket.emit('join-monitoring');
    }
  }

  // Leave monitoring room
  leaveMonitoringRoom(): void {
    if (this.socket) {
      this.socket.emit('leave-monitoring');
    }
  }

  // Start packet capture
  startCapture(interfaceName: string): void {
    if (this.socket) {
      this.socket.emit('start-capture', interfaceName);
    }
  }

  // Stop packet capture
  stopCapture(): void {
    if (this.socket) {
      this.socket.emit('stop-capture');
    }
  }

  // Get available network interfaces
  getInterfaces(): void {
    if (this.socket) {
      this.socket.emit('get-interfaces');
    }
  }
}

export const socketService = new SocketService();

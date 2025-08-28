import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket) {
      return this.socket;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    this.socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to backend server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from backend server');
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.socket?.connected === true;
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

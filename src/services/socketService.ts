import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private connectionAttempts = 0;
  private maxConnectionAttempts = 3;

  connect(): Socket {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    this.socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: this.maxConnectionAttempts,
      reconnectionDelay: 2000,
      forceNew: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to backend server');
      this.isConnected = true;
      this.connectionAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from backend server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error: Error) => {
      this.connectionAttempts++;
      console.warn(`Connection attempt ${this.connectionAttempts}/${this.maxConnectionAttempts} failed:`, error.message);
      this.isConnected = false;
      
      if (this.connectionAttempts >= this.maxConnectionAttempts) {
        console.warn('Max connection attempts reached. Backend server may not be running.');
        console.info('The application will continue to work with simulated data.');
      }
    });

    this.socket.on('reconnect_failed', () => {
      console.warn('Failed to reconnect to backend server after maximum attempts.');
      console.info('The application will continue to work with simulated data.');
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

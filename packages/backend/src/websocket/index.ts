import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
}

export const setupWebSocket = (io: SocketIOServer) => {
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
        userId: string;
        role: string;
      };
      socket.userId = decoded.userId;
      socket.role = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Join role-based room for helpers
    if (socket.role === 'helper' || socket.role === 'counselor' || socket.role === 'crisis_responder') {
      socket.join('helpers');
    }

    // Join admin room
    if (socket.role === 'admin') {
      socket.join('admins');
    }

    // Handle training session messages
    socket.on('training:message', (data) => {
      socket.to(`session:${data.sessionId}`).emit('training:message', {
        ...data,
        userId: socket.userId,
      });
    });

    // Handle support session messages
    socket.on('support:message', (data) => {
      socket.to(`session:${data.sessionId}`).emit('support:message', {
        ...data,
        senderId: socket.userId,
      });
    });

    // Typing indicators
    socket.on('typing:start', (data) => {
      socket.to(`session:${data.sessionId}`).emit('typing:start', {
        userId: socket.userId,
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`session:${data.sessionId}`).emit('typing:stop', {
        userId: socket.userId,
      });
    });

    // Crisis detection - broadcast to helpers immediately
    socket.on('crisis:detected', (data) => {
      logger.warn(`Crisis detected for user ${socket.userId}`, data);
      io.to('helpers').emit('crisis:alert', {
        userId: socket.userId,
        sessionId: data.sessionId,
        severity: data.severity,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    // Helper joining a support session
    socket.on('support:join', (sessionId) => {
      socket.join(`session:${sessionId}`);
      logger.info(`User ${socket.userId} joined support session ${sessionId}`);
    });

    // Helper leaving a support session
    socket.on('support:leave', (sessionId) => {
      socket.leave(`session:${sessionId}`);
      logger.info(`User ${socket.userId} left support session ${sessionId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });

  // Periodic health check for connections
  setInterval(() => {
    io.fetchSockets().then((sockets) => {
      logger.debug(`Active connections: ${sockets.length}`);
    });
  }, 60000);

  return io;
};

export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: unknown) => {
  io.to(`user:${userId}`).emit(event, data);
};

export const emitToHelpers = (io: SocketIOServer, event: string, data: unknown) => {
  io.to('helpers').emit(event, data);
};

export const emitToSession = (io: SocketIOServer, sessionId: string, event: string, data: unknown) => {
  io.to(`session:${sessionId}`).emit(event, data);
};

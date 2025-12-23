"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitToSession = exports.emitToHelpers = exports.emitToUser = exports.setupWebSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_js_1 = require("../utils/logger.js");
const setupWebSocket = (io) => {
    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication required'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
            socket.userId = decoded.userId;
            socket.role = decoded.role;
            next();
        }
        catch (error) {
            next(new Error('Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        logger_js_1.logger.info(`User connected: ${socket.userId}`);
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
            logger_js_1.logger.warn(`Crisis detected for user ${socket.userId}`, data);
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
            logger_js_1.logger.info(`User ${socket.userId} joined support session ${sessionId}`);
        });
        // Helper leaving a support session
        socket.on('support:leave', (sessionId) => {
            socket.leave(`session:${sessionId}`);
            logger_js_1.logger.info(`User ${socket.userId} left support session ${sessionId}`);
        });
        // Disconnect
        socket.on('disconnect', () => {
            logger_js_1.logger.info(`User disconnected: ${socket.userId}`);
        });
    });
    // Periodic health check for connections
    setInterval(() => {
        io.fetchSockets().then((sockets) => {
            logger_js_1.logger.debug(`Active connections: ${sockets.length}`);
        });
    }, 60000);
    return io;
};
exports.setupWebSocket = setupWebSocket;
const emitToUser = (io, userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
};
exports.emitToUser = emitToUser;
const emitToHelpers = (io, event, data) => {
    io.to('helpers').emit(event, data);
};
exports.emitToHelpers = emitToHelpers;
const emitToSession = (io, sessionId, event, data) => {
    io.to(`session:${sessionId}`).emit(event, data);
};
exports.emitToSession = emitToSession;
//# sourceMappingURL=index.js.map
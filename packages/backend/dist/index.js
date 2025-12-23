"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const training_routes_js_1 = __importDefault(require("./routes/training.routes.js"));
const support_routes_js_1 = __importDefault(require("./routes/support.routes.js"));
const ai_routes_js_1 = __importDefault(require("./routes/ai.routes.js"));
const progress_routes_js_1 = __importDefault(require("./routes/progress.routes.js"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const requestLogger_js_1 = require("./middleware/requestLogger.js");
const index_js_1 = require("./websocket/index.js");
const logger_js_1 = require("./utils/logger.js");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
exports.io = io;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined', { stream: { write: (msg) => logger_js_1.logger.info(msg.trim()) } }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});
// API Routes
app.use('/api/users', user_routes_js_1.default);
app.use('/api/training', training_routes_js_1.default);
app.use('/api/support', support_routes_js_1.default);
app.use('/api/ai', ai_routes_js_1.default);
app.use('/api/progress', progress_routes_js_1.default);
// Error handling
app.use(errorHandler_js_1.errorHandler);
app.use(requestLogger_js_1.requestLogger);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});
// Setup WebSocket
(0, index_js_1.setupWebSocket)(io);
// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    logger_js_1.logger.info(`🚀 MindHack Backend running on port ${PORT}`);
    logger_js_1.logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger_js_1.logger.info(`🔗 API: http://localhost:${PORT}/api`);
    logger_js_1.logger.info(`🔌 WebSocket: ws://localhost:${PORT}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_js_1.logger.info('SIGTERM received. Shutting down gracefully...');
    httpServer.close(() => {
        logger_js_1.logger.info('Server closed.');
        process.exit(0);
    });
});
process.on('unhandledRejection', (reason, promise) => {
    logger_js_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
//# sourceMappingURL=index.js.map
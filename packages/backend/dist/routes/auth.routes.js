"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const logger_js_1 = require("../utils/logger.js");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Validation schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Register
router.post('/register', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const data = registerSchema.parse(req.body);
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new errorHandler_js_1.AppError('Email already registered', 400, 'EMAIL_EXISTS');
    }
    // Hash password
    const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
    // Create user
    const user = await prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            name: data.name,
            profile: {
                create: {},
            },
            progress: {
                create: {},
            },
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
        },
    });
    // Generate token
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    logger_js_1.logger.info(`User registered: ${user.email}`);
    res.status(201).json({
        success: true,
        data: {
            user,
            token,
        },
    });
}));
// Login
router.post('/login', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const data = loginSchema.parse(req.body);
    // Find user
    const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            isActive: true,
        },
    });
    if (!user) {
        throw new errorHandler_js_1.AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }
    // Check password
    const isValid = await bcryptjs_1.default.compare(data.password, user.passwordHash);
    if (!isValid) {
        throw new errorHandler_js_1.AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }
    if (!user.isActive) {
        throw new errorHandler_js_1.AppError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }
    // Generate token
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    logger_js_1.logger.info(`User logged in: ${user.email}`);
    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        },
    });
}));
// Get current user
router.get('/me', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new errorHandler_js_1.AppError('No token provided', 401, 'NO_TOKEN');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatarUrl: true,
            createdAt: true,
            profile: true,
        },
    });
    if (!user) {
        throw new errorHandler_js_1.AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    res.json({
        success: true,
        data: { user },
    });
}));
// Refresh token
router.post('/refresh', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new errorHandler_js_1.AppError('No token provided', 401, 'NO_TOKEN');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
    const newToken = jsonwebtoken_1.default.sign({ userId: decoded.userId, role: decoded.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({
        success: true,
        data: { token: newToken },
    });
}));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = exports.asyncHandler = exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const logger_js_1 = require("../utils/logger.js");
class AppError extends Error {
    statusCode;
    code;
    isOperational;
    constructor(message, statusCode, code = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    logger_js_1.logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: err.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            },
        });
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
            },
        });
    }
    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'DATABASE_ERROR',
                message: 'A database error occurred',
            },
        });
    }
    // Default error
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message,
        },
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
            },
        });
    }
    next();
};
exports.requireAuth = requireAuth;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions',
                },
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=errorHandler.js.map
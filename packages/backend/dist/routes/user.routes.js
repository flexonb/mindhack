"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all helpers (public)
router.get('/helpers', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const { role, specialty, available } = req.query;
    const helpers = await prisma.helper.findMany({
        where: {
            isVerified: true,
            isAvailable: available === 'true' ? true : undefined,
            role: role,
            specialties: specialty ? { has: specialty } : undefined,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                },
            },
        },
        orderBy: { rating: 'desc' },
    });
    res.json({
        success: true,
        data: { helpers },
    });
}));
// Get specific helper (public)
router.get('/helpers/:id', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const helper = await prisma.helper.findUnique({
        where: { id: req.params.id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                },
            },
            credentials: {
                where: { isVerified: true },
            },
            availability: true,
        },
    });
    if (!helper) {
        return res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Helper not found' },
        });
    }
    res.json({
        success: true,
        data: { helper },
    });
}));
// Get all resources (public)
router.get('/resources', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const { category, type, search } = req.query;
    const resources = await prisma.resource.findMany({
        where: {
            isPublished: true,
            category: category,
            type: type,
            OR: search ? [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ] : undefined,
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json({
        success: true,
        data: { resources },
    });
}));
// Get specific resource (public)
router.get('/resources/:id', (0, errorHandler_js_1.asyncHandler)(async (req, res) => {
    const resource = await prisma.resource.findUnique({
        where: { id: req.params.id },
    });
    if (!resource) {
        return res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Resource not found' },
        });
    }
    res.json({
        success: true,
        data: { resource },
    });
}));
exports.default = router;
//# sourceMappingURL=user.routes.js.map
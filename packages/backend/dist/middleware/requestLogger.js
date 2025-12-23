"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_js_1 = require("../utils/logger.js");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('user-agent'),
            ip: req.ip,
        };
        if (res.statusCode >= 400) {
            logger_js_1.logger.warn(logData);
        }
        else {
            logger_js_1.logger.info(logData);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=requestLogger.js.map
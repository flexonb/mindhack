import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    code: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number, code?: string);
}
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireRole: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=errorHandler.d.ts.map
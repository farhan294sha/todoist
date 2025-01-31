import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpsException } from "../exceptions/root";

export function errorMiddleware(err: HttpsException, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    const statusCode = err.statusCode || 500;

    // Provide defaults for message and errorCode if not defined
    const message = err.message || 'Internal Server Error';
    const errorCode = err.errorCode || 'INTERNAL_ERROR';
    return res.status(statusCode).json({
        message: message,
        errorCode: errorCode,
        error: err.errors || null
    })
}
import { ErrorCode, HttpsException } from "./root";

export class UnauthorizedException extends HttpsException{
    constructor(message: string, errorCode: ErrorCode, error?: any) {
        super(message, errorCode, 403, error)
    }
}
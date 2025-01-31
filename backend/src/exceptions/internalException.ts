import { ErrorCode, HttpsException } from "./root";

export class InternalException extends HttpsException{
    constructor(message: string, error: any, errorCode: ErrorCode) {
        super(message, errorCode, 500, error)
    }
}
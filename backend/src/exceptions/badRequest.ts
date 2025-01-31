import { ErrorCode, HttpsException } from "./root";

export class BadRequestsException extends HttpsException{
    constructor(message: string, errorCode: ErrorCode) {
        super(message, errorCode, 400, null)
    }

}
import { ErrorCode, HttpsException } from "./root";

export class NotFoundException extends HttpsException{
    constructor(message: string, errorCode: ErrorCode) {
        super(message, errorCode, 404, null)
    }

}
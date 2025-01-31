import { ErrorCode, HttpsException } from "./root";

export class UnprocessableEntity extends HttpsException{
    constructor(error: any, message: string, erroCode: ErrorCode) {
        super(message, erroCode, 422, error)
    }
}
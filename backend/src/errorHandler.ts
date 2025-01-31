import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpsException } from "./exceptions/root";
import { InternalException } from "./exceptions/internalException";

export function erroHandler(controler: Function){
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controler(req, res, next);
        } catch (err: any) {
            let exceptions: HttpsException;
            if (err instanceof HttpsException) {
                exceptions = err
            } else {
                exceptions = new InternalException("Somthing went wrong", err, ErrorCode.INTERNAL_ERROR)
            }
            next(exceptions)
        }

    }
}
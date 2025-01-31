import { NextFunction, Request, Response } from "express";
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCode } from "../exceptions/root";

export function validateUpdateTodo(req: Request, res: Response, next: NextFunction) {
    const {id, createdAt, userId, ...updateData} = req.body
    if (id || createdAt || userId) {
        throw new UnprocessableEntity({error: "cannot update id, createdAt, userId"}, "cannot update", ErrorCode.BAD_REQUEST)
    }

    req.body = updateData;
    next()
}
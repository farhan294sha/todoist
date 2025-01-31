import {  Router } from "express";
import authRouter from "./auth";
import todoRouter from "./todo";
import projectRouter from "./project";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);

rootRouter.use("/todo", todoRouter);

rootRouter.use("/project", projectRouter);

export default rootRouter
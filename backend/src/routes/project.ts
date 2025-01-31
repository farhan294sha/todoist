import { Router } from "express";
import { erroHandler } from "../errorHandler";
import { authMiddleware  } from "../middlewares/authMiddlewares";
import { createProject, getAllProjects, getProjectById } from "../controllers/project";

const projectRouter: Router = Router();

projectRouter.get("/", [authMiddleware], erroHandler(getAllProjects));
projectRouter.post("/", [authMiddleware], erroHandler(createProject));
projectRouter.get("/:todoId", [authMiddleware], erroHandler(getProjectById));


export default projectRouter
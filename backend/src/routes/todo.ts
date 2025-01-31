import { Router } from "express";
import { erroHandler } from "../errorHandler";
import { authMiddleware  } from "../middlewares/authMiddlewares";
import { createSubTask, createTodo, deleteSubtask, deleteTodo, getAllTodos, getTodoById, updateSubTaks, updateTodo } from "../controllers/todo";
import { validateUpdateTodo } from "../middlewares/validateUpdate";

const todoRouter: Router = Router();

todoRouter.get("/", [authMiddleware], erroHandler(getAllTodos));
todoRouter.post("/", [authMiddleware, validateUpdateTodo], erroHandler(createTodo));
todoRouter.get("/:todoId", [authMiddleware], erroHandler(getTodoById));
todoRouter.put("/:todoId", [authMiddleware, validateUpdateTodo], erroHandler(updateTodo));
todoRouter.delete("/:todoId", [authMiddleware], erroHandler(deleteTodo));
todoRouter.put("/subtask/:subTaskId", [authMiddleware, validateUpdateTodo], erroHandler(updateSubTaks));
todoRouter.delete("/subtask/:subTaskId", [authMiddleware], erroHandler(deleteSubtask));
todoRouter.post("/subtask/:todoId", [authMiddleware], erroHandler(createSubTask));




export default todoRouter
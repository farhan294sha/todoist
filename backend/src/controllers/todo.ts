import { Request, Response } from "express";
import { prisma } from "../db";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { createSubTaskSchema, createTodoSchema, updateSubTaskSchema, updateTodoSchema } from "../schema/todo";
import { UnprocessableEntity } from "../exceptions/validation";

export async function getAllTodos(req: Request, res: Response) {
  const todos = await prisma.user.findUnique({
    where: {
      id: req.user,
    },
    select: {
      id: true,
      email: true,
      todos: {
        include: {
          comments: {
            select: {
              content: true,
              userId: true,
              todoId: true,
            },
          },
        },
      },
    },
  });
  if (!todos)
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  res.json({ todos });
}

export async function getTodoById(req: Request, res: Response) {
  const todoId = req.params.todoId;
  const todo = await prisma.todo.findUnique({
    where: {
      userId: req.user,
      id: todoId,
    },
    include: {
      comments: {
        select: {
          content: true,
          userId: true,
          todoId: true
        },
      },
      subTasks: {
        select: {
          description: true,
          id: true,
          title: true,
          done: true
        },
      },
    },
  });
  if (!todo)
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  res.json({ todo });
}

export async function updateSubTaks(req: Request, res: Response) {
  const response = updateSubTaskSchema.safeParse(req.body);
  if (!response.success) {
    throw new UnprocessableEntity(
      response.error,
      "Invalid input",
      ErrorCode.BAD_REQUEST
    );
  }
  const subTaskId = req.params.subTaskId;
  try {
    const subTask = await prisma.subTask.update({
      where: {
        id: subTaskId,
      },
      data: req.body,
    });
    res.json({ subTask });
  } catch (error) {
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  }
}

export async function createSubTask(req: Request, res: Response) {
  const response = createSubTaskSchema.safeParse(req.body);
  if (!response.success) {
    throw new UnprocessableEntity(
      response.error,
      "Invalid input",
      ErrorCode.BAD_REQUEST
    );
  }
  const todoId = req.params.todoId;
  try {
    const subTask = await prisma.subTask.create({
      data: {todoId: todoId ,...response.data },
    });
    res.json({ subTask });
  } catch (error) {
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  }
}


export async function updateTodo(req: Request, res: Response) {
  const response = updateTodoSchema.safeParse(req.body);
  if (!response.success) {
    throw new UnprocessableEntity(
      response.error,
      "Invalid input",
      ErrorCode.BAD_REQUEST
    );
  }
  const todoId = req.params.todoId;
  try {
    const todo = await prisma.todo.update({
      where: {
        id: todoId,
        userId: req.user,
      },
      include: {
        comments: {
          select: {
            content: true,
            userId: true,
            todoId: true,
          },
        },
      },
      data: req.body,
    });
    res.json({ todo });
  } catch (error) {
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  }
}

export async function createTodo(req: Request, res: Response) {
  const response = createTodoSchema.safeParse(req.body);
  if (!response.success) {
    throw new UnprocessableEntity(
      response.error,
      "Invalid input",
      ErrorCode.BAD_REQUEST
    );
  }
  const newTodo = req.body;
  newTodo.userId = req.user;
  const createdTodo = await prisma.todo.create({
    data: newTodo,
    include: {
      comments: {
        select: {
          content: true,
          userId: true,
          todoId: true,
        },
      },
    },
  });
  if (!createdTodo)
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  res.json({ createdTodo });
}


export async function deleteSubtask(req: Request, res: Response) {
  const subTaskID = req.params.subTaskId;
  const deletedTodo = await prisma.subTask.delete({
    where: { id: subTaskID},
  });
  if (!deletedTodo)
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  res.json({ message: `subTask deleted with id : ${deletedTodo.id}` });
}

// need to update prisma schema where deleted is boolen
export async function deleteTodo(req: Request, res: Response) {
  const todoId = req.params.todoId;
  const deletedTodo = await prisma.todo.delete({
    where: { id: todoId, userId: req.user },
  });
  if (!deletedTodo)
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  res.json({ message: `todo deleted with id : ${deletedTodo.id}` });
}

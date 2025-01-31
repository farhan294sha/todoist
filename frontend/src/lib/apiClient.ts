import { TcreateTodoTypes, TtodoSchema } from "@shared/schemas/todoSchema";
import axios from "axios";

export type ProjectTypes = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  parentId: string | null;
};

interface ResponseTodos {
  todos: {
    id: string;
    email: string;
    todos: TtodoSchema[];
  };
}

export type UpdateSubTask = {
  title: string;
  description: string | null;
  done: boolean;
};

interface ApiCreateSubTaks extends UpdateSubTask {
  id: string;
  todoId: string;
}

type CreateSubtask = {
  title: string;
  description: string | null;
};

type ApiProjectReponseData = {
  id: string;
  projects: ProjectTypes[];
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchAllTodos = async () => {
  return apiClient.get<ResponseTodos>("api/todo");
};

export const apiUpdateTodo = async (
  defaultTodoId: string,
  data: Partial<TtodoSchema>
) => {
  if (!defaultTodoId) {
    throw new Error("todoId is null");
  }
  return apiClient.put<{ todo: TtodoSchema }>(
    `api/todo/${defaultTodoId}`,
    data
  );
};


export const apiCreateTodo = async (todo: TcreateTodoTypes) => {
  if (!todo) {
    throw new Error("todo is null");
  }
  return apiClient.post<{ createdTodo: TtodoSchema }>("api/todo", todo);
};

export const apiDelteTodo = async (todoId: string) => {
  if (!todoId) {
    throw new Error("todoId is null");
  }
  return apiClient.delete(`api/todo/${todoId}`);
};

export interface ApiGetTodoByIdType extends TtodoSchema {
  subTasks: {
    id: string;
    description: string | null;
    title: string;
    done: boolean;
  }[];
}

export const apiGetTodoById = async (todoId: string) => {
  if (!todoId) {
    throw new Error("todoId is null");
  }
  return apiClient.get<{ todo: ApiGetTodoByIdType }>(`api/todo/${todoId}`);
};

export const getAllProjects = async () => {
  return apiClient.get<ApiProjectReponseData>("api/project");
};

// SUBTASK

export const apiUpdateSubTodo = async (
  subTaskId: string,
  data: Partial<UpdateSubTask>
) => {
  if (!subTaskId) {
    throw new Error("subtaskId is null");
  }
  return apiClient.put(`api/todo/subtask/${subTaskId}`, data);
};

export const apiDeleteSubTask = async (subTaskID: string) => {
  if (!subTaskID) {
    throw new Error("todoId is null");
  }
  return apiClient.delete(`api/todo/subtask/${subTaskID}`);
};

export const apiCreateSubTask = async(todoId: string,subTask: CreateSubtask) => {
  if (!subTask) {
    throw new Error("todo is null");
  }
  return apiClient.post<{ subTask: ApiCreateSubTaks }>(`api/todo/subtask/${todoId}`, subTask);
};

export default apiClient;

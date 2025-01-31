import { fetchAllTodos, getAllProjects, ProjectTypes } from "@/lib/apiClient";
import { safeAwait } from "@/lib/utils";
import { TtodoSchema } from "@shared/schemas/todoSchema";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

export const tokenState = atom<string | null>({
  key: "tokenState",
  default: null,
});

export const todoFamily = atomFamily<TtodoSchema | null, string>({
  key: "Todofamily",
  default: selectorFamily({
    key: "todoSelector",
    get:
      (params) =>
      ({ get }) => {
        const alltodos = get(todosList);
        const todoWithid = alltodos.find((todo) => todo.id === params);
        if (!todoWithid) return null;
        return todoWithid;
      },
  }),
});
type User = {
  id: string;
  name: string;
  email: string;
  picture: string | undefined;
};
export const userState = atom<User | null>({
  key: "userState",
  default: null,
});

export const todosList = atom<TtodoSchema[]>({
  key: "todosList",
  default: selector({
    key: "defalut/todoList",
    get: async ({ get }) => {
      console.log("feched all todos from BE");
      const user = get(userState);
      if (!user) return [];
      const [err, response] = await safeAwait(fetchAllTodos());
      if (err) {
        console.error("falied to fetch todo");
        return [];
      }
      return response.data.todos.todos;
    },
  }),
});

export const projectList = atom<ProjectTypes[]>({
  key: "projectlist",
  default: selector({
    key: "default/projectList",
    get: async () => {
      const [err, response] = await safeAwait(getAllProjects());
      if (err) {
        console.error("falied to fetch todo");
        return [];
      }
      return response.data.projects;
    },
  }),
});


export const todoProject = atomFamily({
  key: "ProjectFamily",
  default: selectorFamily({
    key: "defalut/projectFamily",
    get:
      (param: string) =>
      ({ get }) => {
        const todo = get(todoFamily(param));
        const allProject = get(projectList);
        const projectId = todo?.projectId;
        if (!projectId) return null;
        const project = allProject.find((pro) => pro.id === projectId);
        if (!project) return null;
        return project;
      },
  }),
});

import { selector, selectorFamily } from "recoil";
import { projectList, todosList } from "./atom";
import { TtodoSchema } from "@shared/schemas/todoSchema";
import { AccordionVariants } from "@/components/TodoAccordion";

export const pendingTask = selector<TtodoSchema[]>({
  key: "pendingTask",
  get: ({ get }) => {
    const atomTodos = get(sortedTodoListSelector);
    return atomTodos.filter((todo) => todo.done === false);
  },
});

export const pendingTaskforToday = selectorFamily({
  key: "pendingTaskfortoday",
  get:
    (currentDate: Date) =>
    ({ get }) => {
      const atomTodos = get(taskOverdue(currentDate));
      const todayTask = get(taskOverdueforPecificDay(currentDate));
      return atomTodos.length + todayTask.length;
    },
});

export const taskOverdueforPecificDay = selectorFamily({
  key: "OverDueTaks",
  get:
    (currentDate: Date) =>
    ({ get }) => {
      const pendingTodos = get(pendingTask);

      if (!Array.isArray(pendingTodos)) return [];

      //  setting time to 00:00:00
      const normalizedCurrentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );

      // Filter tasks that are due on the provided date
      return pendingTodos.filter((task) => {
        if (!task.dueDate) return false;

        const taskDueDate = new Date(task.dueDate);

        const normalizedTaskDueDate = new Date(
          taskDueDate.getFullYear(),
          taskDueDate.getMonth(),
          taskDueDate.getDate()
        );

        return (
          normalizedTaskDueDate.getTime() === normalizedCurrentDate.getTime()
        );
      });
    },
});

export const taskOverdue = selectorFamily({
  key: "OverDueTaks",
  get:
    (currentDate: Date) =>
    ({ get }) => {
      const pendingTodos = get(pendingTask);

      if (!Array.isArray(pendingTodos)) return [];

      //  setting time to 00:00:00
      const normalizedCurrentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );

      // Filter tasks that are due on the provided date
      return pendingTodos.filter((task) => {
        if (!task.dueDate) return false;

        const taskDueDate = new Date(task.dueDate);

        const normalizedTaskDueDate = new Date(
          taskDueDate.getFullYear(),
          taskDueDate.getMonth(),
          taskDueDate.getDate()
        );

        return (
          normalizedTaskDueDate.getTime() < normalizedCurrentDate.getTime()
        );
      });
    },
});

export const todayTodos = selector({
  key: "todayTodos",
  get: ({ get }) => {
    const atomTodos = get(sortedTodoListSelector);
    const todayDate = new Date().setHours(0, 0, 0, 0);
    return atomTodos.filter((todo) => {
      if (!todo.dueDate) return false;
      return new Date(todo.dueDate).setHours(0, 0, 0, 0) === todayDate;
    });
  },
});

export const todosInProject = selectorFamily({
  key: "todoProject",
  get:
    (projectId: string) =>
    ({ get }) => {
      const sortedTodo = get(sortedTodoListSelector);
      return sortedTodo.filter((todo) => todo.projectId === projectId);
    },
});

export const projectWithId = selectorFamily({
  key: "projectwithId",
  get:
    (proejctId: string) =>
    ({ get }) => {
      const allProject = get(projectList);
      const project = allProject.find((project) => project.id === proejctId);
      if (!project) return null;
      return project;
    },
});

export const projectWithTodoId = selectorFamily({
  key: "projectWithTodoId",
  get:
    (todoId: string) =>
    ({ get }) => {
      const todoList = get(todosList);
      const proejctId = todoList.find((todo) => todo.id === todoId)?.projectId;
      if (!proejctId) return null;
      return get(projectWithId(proejctId));
    },
});

export const projectInbox = selector({
  key: "inboxId",
  get: ({ get }) => {
    const allProject = get(projectList);
    const sortedTodo = get(sortedTodoListSelector);
    const inboxId = allProject.find((project) => project.name === "Inbox")?.id;
    if (!inboxId) return [];
    return sortedTodo.filter((todo) => todo.projectId === inboxId);
  },
});

export const sortedTodoListSelector = selector({
  key: "sortedList",
  get: ({ get }) => {
    const todoList = get(todosList);
    return todoList.slice().sort((a, b) => {
      // sort by done
      const sortedByDone = Number(a.done) - Number(b.done);

      if (sortedByDone === 0) {
        // If `done` status is the same, sort by `priority`
        const sortByPriority = b.priority - a.priority;

        if (sortByPriority === 0) {
          // If `priority` is the same, sort by `dueDate`
          if (a.dueDate && b.dueDate) {
            return (
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
          } else if (a.dueDate && !b.dueDate) {
            return -1; // a has dueDate, b does not, so a comes first
          } else if (!a.dueDate && b.dueDate) {
            return 1; // b has dueDate, a does not, so b comes first
          } else {
            // If neither have a dueDate, sort by `createdAt`
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }
        }
        // If `done` status is the same, sort by `priority`
        return sortByPriority;
      }

      // Return the result of `done` status comparison
      return sortedByDone;
    });
  },
});

export const overDueTodo = selector({
  key: "overdueTodo",
  get: ({ get }) => {
    const allTodos = get(todosList);
    return allTodos.filter((todo) => {
      if (!todo.dueDate) return false;
      const currentTimeMilliSec = new Date().getTime();
      const todoDueDateMillSec = new Date(todo.dueDate).getTime();
      if (todoDueDateMillSec < currentTimeMilliSec) {
        return true;
      } else {
        return false;
      }
    });
  },
});

export const selectedTodoList = selectorFamily({
  key: "selectedTodolist",
  get:
    ({
      variant,
      projectId,
    }: {
      variant: AccordionVariants;
      projectId?: string;
    }) =>
    ({ get }) => {
      let todoList: TtodoSchema[];
      switch (variant) {
        case AccordionVariants.OverDue:
          todoList = get(taskOverdue(new Date()));
          break;

        case AccordionVariants.Project:
          if (projectId) {
            todoList = get(todosInProject(projectId));
          } else {
            // for inbox
            todoList = get(projectInbox);
          }
          break;
        case AccordionVariants.Today:
          todoList = get(todayTodos);
          break;

        default:
          todoList = get(sortedTodoListSelector);
          break;
      }
      return todoList;
    },
});

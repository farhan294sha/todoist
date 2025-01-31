import { useRecoilValue } from "recoil";
import TodoItem from "@/components/TodoItem";
import {
  projectInbox,
  sortedTodoListSelector,
  taskOverdue,
  todayTodos,
  todosInProject,
} from "@/store/selector";
import { Suspense } from "react";
import CenterSpinner from "./Spinner";
import { TtodoSchema } from "@shared/schemas/todoSchema";
import { useParams } from "react-router-dom";
import { AccordionVariants } from "./TodoAccordion";
import { useAccordionContext } from "@/context/AccodianContext";
("./AddTodoButton");

const TodoList = () => {
  let todoList: TtodoSchema[];
  const { variant } = useAccordionContext();
  switch (variant) {
    case AccordionVariants.OverDue:
      todoList = useRecoilValue(taskOverdue(new Date()));
      break;

    case AccordionVariants.Project:
      const { projectId } = useParams();
      if (projectId) {
        todoList = useRecoilValue(todosInProject(projectId!));
      } else {
        // for inbox
        todoList = useRecoilValue(projectInbox);
      }
      break;
    case AccordionVariants.Today:
      todoList = useRecoilValue(todayTodos);
      break;

    default:
      todoList = useRecoilValue(sortedTodoListSelector);
      break;
  }
  return (
    <div>
      <Suspense fallback={<CenterSpinner />}>
        {todoList.map((todo) => (
          <TodoItem key={todo.id} id={todo.id} />
        ))}
      </Suspense>
    </div>
  );
};

export default TodoList;

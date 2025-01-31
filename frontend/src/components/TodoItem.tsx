import { todoFamily, todoProject, todosList } from "@/store/atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AlarmClock, GripVertical, Hash, Inbox } from "lucide-react";
import CommentIcon from "@/components/CommentIcon";
import { getPriorityColor } from "@/utils/color";
import DueDateDisplay from "@/components/DueDateDisplay";
import TodoListEditOptions from "@/components/TodoListEditOptions";
import React, { MouseEvent, useState } from "react";
import { TtodoSchema } from "@shared/schemas/todoSchema";
import { DueDateDropDown } from "@/components/todo-input/DueDateComponents";
import AddTodoInputs from "@/components/todo-input/AddTodoInputs";
import { apiDelteTodo, apiUpdateTodo } from "@/lib/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { cn, safeAwait } from "@/lib/utils";
import { removeItemAtIndex } from "@/utils/utils";
import TodoContextMenu from "./TodoItemContext-menu";
import { Link } from "react-router-dom";
import CheakButton from "./CheakButton";
import AddTodoDialoge from "./AddTodoDialoge";

const TodoItem = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const todo = useRecoilValue(todoFamily(id));
  const project = useRecoilValue(todoProject(id));
  const setTodoList = useSetRecoilState(todosList);
  const [editTodo, setEditTodo] = useState(false);
  const [openDialoge, setOpenDialoge] = useState(false);
  if (!todo) return null;

  const { pColor, hColor } = getPriorityColor(todo.priority);

  const updateTodoState = async (
    id: string,
    update: Partial<TtodoSchema>,
    method: "delete" | "update" = "update"
  ) => {
    if (method === "delete") {
      const [err, _] = await safeAwait(apiDelteTodo(id));
      if (err) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with delete todo",
        });
        return;
      }

      setTodoList((prevTodos) => {
        const todoIndex = prevTodos.findIndex((todo) => todo.id === id);
        if (todoIndex === -1) {
          toast({
            variant: "default",
            title: "Cannot find todo",
          });
          return prevTodos;
        }
        toast({
          variant: "default",
          title: "Deleted todo",
        });
        return removeItemAtIndex(prevTodos, todoIndex);
      });
      return;
    }
    const [err] = await safeAwait(apiUpdateTodo(id, update));
    if (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      return;
    }

    setTodoList((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, ...update } : todo))
    );
    toast({
      variant: "default",
      title: "Todo updated",
    });
  };

  function openDialogePropagationControl(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;
    let level = 0;
    let element = target;

    // Traverse up the DOM hierarchy to count levels
    while (element && element !== currentTarget) {
      level++;
      element = element.parentElement!;
    }

    const maxAllowedDepth = 3; // Specify the level of children that should open the dialog

    if (level <= maxAllowedDepth) {
      e.stopPropagation();
      setOpenDialoge(true);
    } else {
      e.stopPropagation();
    }
  }

  function handleDone(e: MouseEvent<HTMLButtonElement>, id: string) {
    e.preventDefault();
    const currentTodo = todo as TtodoSchema;
    updateTodoState(id, { done: !currentTodo.done });
  }
  if (editTodo) {
    return (
      <AddTodoInputs defaultTodoId={id} setShowAddTodoInput={setEditTodo} />
    );
  }

  if (openDialoge) {
    return (
      <div
        className="fixed  inset-0 z-50 bg-black/80 transition-all  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        data-state="open"
      >
        <AddTodoDialoge
          pColor={pColor}
          hColor={pColor}
          todoStateUpdater={updateTodoState}
          todoId={id}
          setOpenDialoge={setOpenDialoge}
          isOpen={openDialoge}
        />
      </div>
    );
  }

  return (
    <TodoContextMenu
      todoStateUpdater={updateTodoState}
      setEditTodo={setEditTodo}
      todoId={id}
      projectId={project && project.id}
    >
      <div
        className={cn(
          "flex shadow-sm group w-full",
          todo.done && "text-muted-foreground"
        )}
        onClick={openDialogePropagationControl}
      >
        <div className="flex items-center m-2 w-full">
          <div className="absolute -left-2 text-muted-foreground hover:text-accent-foreground cursor-move invisible opacity-0 transition-opacity group-hover:opacity-100 group-hover:visible flex">
            <div>
              <GripVertical size={20} />
            </div>
          </div>
          <div className="group flex flex-col items-center">
            <div className="mb-4">
              <CheakButton
                hColor={hColor}
                pColor={pColor}
                onChange={(e) => handleDone(e, todo.id)}
                todoDone={todo.done}
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 p-2">
            <div
              className={cn(
                "text-sm block",
                todo.done && "text-decoration-line: line-through"
              )}
            >
              {todo.title}
            </div>
            <div className="flex justify-between w-full">
              <div className={`flex text-xs items-center gap-2`}>
                {todo.dueDate && (
                  <DueDateDropDown
                    valueDate={todo.dueDate}
                    asChild={false}
                    onChange={(date) =>
                      updateTodoState(todo.id, {
                        dueDate: date.toISOString(),
                      })
                    }
                  >
                    <DueDateDisplay dueDate={todo.dueDate} done={todo.done} />
                  </DueDateDropDown>
                )}
                {todo.comments.length >= 1 && (
                  <CommentIcon
                    todoId={todo.id}
                    commentLength={todo.comments.length}
                  />
                )}
                {todo.reminder && (
                  <AlarmClock className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              <div className="text-muted-foreground text-xs">
                {project &&
                  (project.name.startsWith("Inbox") ? (
                    <Link
                      className="flex items-center"
                      to={`/project/${project.id}`}
                    >
                      Inbox <Inbox className="ml-2 w-4 h-4" />
                    </Link>
                  ) : (
                    <Link className="flex" to={`/project/${project.id}`}>
                      {project.name}
                      <Hash className="ml-2 w-4 h-4" />
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible flex">
          <TodoListEditOptions
            dateValue={todo.dueDate}
            onChangeDate={(date) =>
              updateTodoState(todo.id, { dueDate: date.toISOString() })
            }
            openEditTodo={setEditTodo}
          />
        </div>
      </div>
    </TodoContextMenu>
  );
};
export default TodoItem;

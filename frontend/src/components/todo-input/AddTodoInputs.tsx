import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-separator";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { DueDateButton, DueDateDropDown } from "./DueDateComponents";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriorityButton, PriorityDropdown } from "./PriorityComponents";
import {
  ReminderButton,
  ReminderPopOver,
} from "@/components/todo-input/ReminderPopOver";
import { Priority } from "@/utils/color";
import { ProjectSelector } from "@/components/todo-input/ProjectSelectionBox";
import { apiCreateTodo, apiUpdateTodo } from "@/lib/apiClient";
import { useRecoilState } from "recoil";
import { todosList } from "@/store/atom";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import {
  createTodoSchema,
  TcreateTodoTypes,
  TtodoSchema,
} from "@shared/schemas/todoSchema";
import { safeAwait } from "@/lib/utils";
import { useAccordionContext } from "@/context/AccodianContext";
import { AccordionVariants } from "../TodoAccordion";

const AddTodoInputs: React.FC<{
  setShowAddTodoInput: Dispatch<SetStateAction<boolean>>;
  defaultTodoId?: string;
}> = ({ setShowAddTodoInput, defaultTodoId }) => {
  const [todos, setTodos] = useRecoilState(todosList);
  const { variant } = useAccordionContext();

  const currentTodo = todos.find((todo) => todo.id === defaultTodoId);


  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<TcreateTodoTypes>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      dueDate: currentTodo?.dueDate || variant === AccordionVariants.Today &&  new Date().toISOString() ||null,
      priority: currentTodo?.priority || Priority.p4,
      title: currentTodo?.title || "",
      description: currentTodo?.description || null,
      reminder: currentTodo?.reminder || null,
      projectId: currentTodo?.projectId || null,
    },
  });

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      handleSubmit(onSubmit)()
    }
  };


  const dueDateValue = watch("dueDate");
  // const titleValue = watch("title");
  const reminderValue = watch("reminder");
  const priorityValue = watch("priority");
  const projectId = watch("projectId");

  

  function showToastError() {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  }

  const onSubmit: SubmitHandler<TcreateTodoTypes> = async (data) => {
    let response: TtodoSchema;
    if (defaultTodoId) {
      // Update the existing todo logic here
      const [updateError, updateResponse] = await safeAwait(
        apiUpdateTodo(defaultTodoId, data)
      );

      if (updateError) {
        console.error("Error in updating todo", updateError);
        showToastError();
        return;
      }

      response = updateResponse.data.todo;

      const updatedTodo = updateResponse.data.todo;
      setTodos((prev) =>
        prev.map((todo) => (todo.id === defaultTodoId ? updatedTodo : todo))
      );
    } else {
      // Create new todo logic
      const [createError, createResponse] = await safeAwait(
        apiCreateTodo(data)
      );

      if (createError) {
        console.error("Error in creating todo", createError);
        showToastError();
        return;
      }

      response = createResponse.data.createdTodo;

      const newTodo = createResponse.data.createdTodo;
      setTodos((prev) => [...prev, newTodo]);
    }

    toast({
      variant: "default",
      title: `Todo ${defaultTodoId ? "Updated" : "Created"}: ${response.title}`,
      description: `Due Date: ${
        response.dueDate
          ? new Date(response.dueDate).toLocaleDateString()
          : "None"
      }`,
    });

    setShowAddTodoInput(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handleKeyDown}
      className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-slate-300 m-1 flex flex-col gap-1"
    >
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <div className="h-7">
        <input
          {...register("title")}
          type="text"
          className="focus-visible:ring-0 w-full h-full p-2 border-none focus:outline-none placeholder:font-medium font-medium"
          placeholder="Task name"
        />
      </div>
      <div>
        <input
          {...register("description")}
          type="text"
          className="focus-visible:ring-0 w-full h-full p-2 border-none focus:outline-none"
          placeholder="Description"
        />
      </div>
      <div className="flex items-center gap-1 pl-2">
        <DueDateDropDown
          valueDate={dueDateValue}
          onChange={(date: Date) => setValue("dueDate", date.toISOString())}
          error={errors.dueDate?.message}
        >
          <DueDateButton
            valueDate={dueDateValue}
            onChange={(date) => setValue("dueDate", date)}
          />
        </DueDateDropDown>

        <PriorityDropdown
          value={priorityValue}
          onChange={(priority) => setValue("priority", priority)}
        >
          <PriorityButton value={priorityValue} />
        </PriorityDropdown>

        <ReminderPopOver
          type="Popover"
          onChange={(date) => setValue("reminder", date.toISOString())}
        >
          <ReminderButton
            reminderValue={reminderValue}
            onChange={(date) => setValue("reminder", date)}
          />
        </ReminderPopOver>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="vsm"
              className="text-muted-foreground text-xs p-2"
            >
              <Ellipsis className="w-3 h-3 mr-2" />
              <span className="sr-only">more actions</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">More actions</TooltipContent>
        </Tooltip>
      </div>
      <Separator className="mt-2" />
      <div className="flex items-center justify-between p-2">
        <div>
          <ProjectSelector
            selectedProjectId={projectId}
            onSet={(projectId) => setValue("projectId", projectId)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="vsm"
            className="text-xs p-2"
            onClick={() => {
              setShowAddTodoInput(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="vsm"
            className="text-xs p-2"
            type="submit"
            disabled={errors.title || isSubmitting ? true : false}
          >
            {defaultTodoId ? "Save" : "Add task"}
          </Button>
        </div>
      </div>
    </form>
  );
};
export default AddTodoInputs;

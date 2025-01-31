import { Button } from "@/components/ui/button";
import EmojiPicker from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  Ellipsis,
  MoreHorizontal,
  Plus,
  SendHorizontal,
  SmileIcon,
  SmilePlus,
  Text,
  Trash2,
  X,
} from "lucide-react";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Separator } from "./ui/separator";
import CheakButton from "./CheakButton";
import {
  createTodoSchema,
  TcreateTodoTypes,
  TtodoSchema,
} from "@shared/schemas/todoSchema";
import { useRecoilValue } from "recoil";
import { cn, safeAwait } from "@/lib/utils";
import {
  apiCreateSubTask,
  apiDeleteSubTask,
  apiGetTodoById,
  ApiGetTodoByIdType,
  apiUpdateSubTodo,
  UpdateSubTask,
} from "@/lib/apiClient";
import { useToast } from "./ui/use-toast";
import { projectWithTodoId, selectedTodoList } from "@/store/selector";
import { Link, useParams } from "react-router-dom";
import { useAccordionContext } from "@/context/AccodianContext";
import { formatDate } from "date-fns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Priority } from "@/utils/color";
import { ProjectSelector } from "./todo-input/ProjectSelectionBox";
import { DueDateButton, DueDateDropDown } from "./todo-input/DueDateComponents";
import {
  PriorityButton,
  PriorityDropdown,
} from "./todo-input/PriorityComponents";
import { ReminderButton, ReminderPopOver } from "./todo-input/ReminderPopOver";
import AddtodoOverlaySkeleton from "./AddtodoOverlaySkeleton";
import { userState } from "@/store/atom";
import { getShortName } from "@/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CustomAccordionTrigger from "./CustomAccordianTrigger";
import { Accordion, AccordionContent, AccordionItem } from "./ui/accordion";

type TodoDialogeProps = {
  pColor: string;
  hColor: string;
  todoStateUpdater: (
    id: string,
    update: Partial<TtodoSchema>,
    method?: "delete" | "update",
  ) => Promise<void>;
  todoId: string;
  setOpenDialoge: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

interface TOverLayTodoTypes extends TcreateTodoTypes {
  done: boolean;
}

function TodoDialoge({
  pColor,
  hColor,
  todoStateUpdater,
  todoId,
  setOpenDialoge,
  isOpen,
}: TodoDialogeProps) {
  const { projectId } = useParams();
  const { variant } = useAccordionContext();
  const todoList = useRecoilValue(selectedTodoList({ variant, projectId }));
  const [currentTodo, setCurrentTodo] = useState(todoId);
  const project = useRecoilValue(projectWithTodoId(currentTodo));
  const [data, setData] = useState<ApiGetTodoByIdType | null>(null);
  const [error, setError] = useState<any>(null);
  const { toast } = useToast();
  const [isLoading, setIsloading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const nextTodoRef = useRef(false);

  useEffect(() => {
    const fetchTodo = async () => {
      setIsloading(true);
      const [err, response] = await safeAwait(apiGetTodoById(currentTodo));
      if (err) {
        setIsloading(false);
        setError(err);
        return;
      }
      const fetchedData = response.data.todo;
      setData(fetchedData);
      setIsloading(false);
    };

    fetchTodo();
  }, [currentTodo, todoStateUpdater]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TOverLayTodoTypes>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      dueDate: null,
      priority: Priority.p4,
      title: "",
      description: null,
      reminder: null,
      projectId: null,
      done: false,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("dueDate", data.dueDate || null);
      setValue("priority", data.priority || Priority.p4);
      setValue("title", data.title || "");
      setValue("description", data.description || null);
      setValue("reminder", data.reminder || null);
      setValue("projectId", data.projectId || null);
      setValue("done", data.done || false);
    }
  }, [data, setValue, currentTodo]);

  const titleValue = watch("title");
  const descValue = watch("description");
  const doneValue = watch("done");
  const projectIdValue = watch("projectId");
  const dueDateValue = watch("dueDate");
  const priorityValue = watch("priority");
  const reminderValue = watch("reminder");

  const handleNextTodo = () => {
    nextTodoRef.current = true;
    const currentIndex = todoList.findIndex((todo) => todo.id === currentTodo);
    if (currentIndex < todoList.length - 1) {
      const nextTodo = todoList[currentIndex + 1];
      setCurrentTodo(nextTodo.id);
    }
  };

  const handlePrevTodo = () => {
    nextTodoRef.current = true;
    const currentIndex = todoList.findIndex((todo) => todo.id === currentTodo);
    if (currentIndex > 0) {
      const prevTodo = todoList[currentIndex - 1];
      setCurrentTodo(prevTodo.id);
    }
  };

  async function updateSubTask(
    id: string,
    method: "DELETE" | "UPDATE" | "CREATE",
    subTaskData: Partial<UpdateSubTask>,
  ) {
    switch (method) {
      case "DELETE":
        let [err, _] = await safeAwait(apiDeleteSubTask(id));
        if (err) {
          toast({
            variant: "destructive",
            title: "Cannot delete",
          });
          return;
        }
        setData((preValue) => {
          if (preValue) {
            const subTasks = preValue.subTasks.filter(
              (subTask) => subTask.id !== id,
            );
            if (!subTasks) return preValue;
            return { ...preValue, subTasks };
          }
          return null;
        });
        toast({
          title: "Sub Task deleted",
        });

        break;

      case "UPDATE":
        [err, _] = await safeAwait(apiUpdateSubTodo(id, subTaskData));
        if (err) {
          toast({
            variant: "destructive",
            title: "Something went wrong",
          });
          return;
        }
        setData((preValue) => {
          if (preValue) {
            const subTaskIndex = preValue.subTasks.findIndex(
              (subTask) => subTask.id === id,
            );
            if (subTaskIndex === -1) return preValue;

            const updatedSubTask = {
              ...preValue.subTasks[subTaskIndex],
              ...subTaskData,
            };

            const updatedSubTasks = [...preValue.subTasks];
            updatedSubTasks[subTaskIndex] = updatedSubTask;

            return {
              ...preValue,
              subTasks: updatedSubTasks,
            };
          }
          return null;
        });
        break;

      case "CREATE":
        if (subTaskData.title === undefined) {
          return;
        }
        const description = subTaskData.description ?? null;

        [err, _] = await safeAwait(
          apiCreateSubTask(currentTodo, {
            title: subTaskData.title ?? "",
            description,
          }),
        );

        //  Need to update the data state

        if (err) {
          console.error("Error creating subtask:", err);
          return;
        }
    }
  }

  const onSubmit: SubmitHandler<TOverLayTodoTypes> = async (data) => {
    if (nextTodoRef.current) {
      nextTodoRef.current = false;
      return;
    }
    todoStateUpdater(currentTodo, data);
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Something went wrong",
    });
    return;
  }
  if (!data) {
    return;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className="sm:max-w-[800px] fixed left-[50%] top-[50%] z-40 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background px-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[500px] overflow-y-auto"
        data-state={isOpen ? "open" : "closed"}
      >
        {" "}
        {isLoading ? (
          <AddtodoOverlaySkeleton />
        ) : (
          <>
            <div className="flex justify-between items-center sticky top-0 bg-white z-30 pt-6">
              <div className="flex space-x-2 items-center">
                {project ? (
                  <Link to={`/project/${project.id}`}>
                    <span className="text-sm text-gray-500">
                      {project ? project.name : "project"}
                    </span>
                  </Link>
                ) : (
                  "Project"
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={handlePrevTodo}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNextTodo}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <DropDownMenuOverLay
                  date={new Date(data.createdAt)}
                  onDelete={() => todoStateUpdater(currentTodo, {}, "delete")}
                >
                  <Button variant="ghost" size="icon">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropDownMenuOverLay>
                <Button
                  variant="ghost"
                  onClick={() => setOpenDialoge(false)}
                  className="ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground "
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between px-2">
              <div className="relative pl-8 pr-4 pt-1 flex-grow flex flex-col gap-5 items-start">
                {showEdit ? (
                  <EditTitle
                    setShowEdit={setShowEdit}
                    onChange={(data) => {
                      setValue("title", data.title);
                      setValue("description", data.description);
                    }}
                    value={{ title: titleValue, description: descValue }}
                  />
                ) : (
                  <div>
                    <div className="flex items-center">
                      <div className="absolute -left-3">
                        <CheakButton
                          hColor={hColor}
                          pColor={pColor}
                          onChange={() => {
                            setValue("done", !doneValue);
                          }}
                          todoDone={doneValue}
                        />
                      </div>
                      <h1
                        onClick={() => setShowEdit(true)}
                        className="font-medium text-xl"
                      >
                        {titleValue}
                      </h1>
                    </div>
                    <div
                      className="text-muted-foreground flex items-center text-sm"
                      onClick={() => setShowEdit(true)}
                    >
                      <Text className="w-4 h-5 mr-2" />
                      {descValue ? descValue : "Description"}
                    </div>
                  </div>
                )}
                {/* Need to update the sublist task */}
                <div className="w-full">
                  {data.subTasks.length > 0 &&
                    data.subTasks.map((task) => {
                      return (
                        <div
                          className="flex items-center justify-between group"
                          key={task.title}
                        >
                          <div>
                            <CheakButton
                              hColor={"text-grey-300"}
                              pColor={"text-grey-300"}
                              onChange={() =>
                                updateSubTask(task.id, "UPDATE", {
                                  done: !task.done,
                                })
                              }
                              todoDone={task.done}
                              size={16}
                              buttonSize="vsm"
                              className="mr-2"
                            />
                            <span
                              className={cn({
                                "line-through text-muted-foreground": task.done,
                              })}
                            >
                              {task.title}
                            </span>
                          </div>
                          <Button variant="ghost">
                            <Trash2 className="size-4 text-red-500 opacity-0 transition-all group-hover:opacity-100" />
                          </Button>
                        </div>
                      );
                    })}
                  <Button
                    type="button"
                    className="w-full text-muted-foreground group items-center justify-start pt-2"
                    variant="ghost"
                  >
                    <Plus className="mr-2 w-4 h-4 group-hover:text-[#E06356] group-hover:stroke-[5px]" />
                    <div className="group-hover:text-[#E06356] text-xs">
                      Add Sub todo
                    </div>
                  </Button>
                </div>

                <div className="relative space-y-2 w-full">
                  {data.comments.length > 0 ? (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <CustomAccordionTrigger className="hover:no-underline bg-white mt-2">
                          Comment {data.comments.length}
                        </CustomAccordionTrigger>
                        <AccordionContent>
                          {data.comments.map((comment) => (
                            <>
                              <CommentDisplay data={comment} />
                              <CommentDisplay data={comment} />
                              <CommentDisplay data={comment} />
                              <CommentDisplay data={comment} />
                              <CommentDisplay data={comment} />
                              <CommentDisplay data={comment} />
                              <CommentDisplay data={comment} />
                              <CommentDisplay data={comment} />
                            </>
                          ))}
                          <CommentInputSection />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <CommentInputSection />
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Project
                    </h3>
                    <div className="flex items-center space-x-2">
                      <ProjectSelector
                        selectedProjectId={projectIdValue}
                        onSet={(projectId) => setValue("projectId", projectId)}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Due date
                    </h3>
                    <DueDateDropDown
                      side="top"
                      valueDate={dueDateValue}
                      onChange={(date: Date) =>
                        setValue("dueDate", date.toISOString())
                      }
                      error={errors.dueDate?.message}
                    >
                      <DueDateButton
                        valueDate={dueDateValue}
                        onChange={(date) => setValue("dueDate", date)}
                      />
                    </DueDateDropDown>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Priority
                    </h3>
                    <PriorityDropdown
                      value={priorityValue}
                      onChange={(priority) => setValue("priority", priority)}
                    >
                      <PriorityButton value={priorityValue} />
                    </PriorityDropdown>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Reminders
                    </h3>
                    <ReminderPopOver
                      type="Popover"
                      onChange={(date) =>
                        setValue("reminder", date.toISOString())
                      }
                    >
                      <ReminderButton
                        reminderValue={reminderValue}
                        onChange={(date) => setValue("reminder", date)}
                      />
                    </ReminderPopOver>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
}

type DropDownMenuOverLayProps = {
  children: React.ReactNode;
  date: Date;
  onDelete: () => void;
};

function DropDownMenuOverLay({
  children,
  date,
  onDelete,
}: DropDownMenuOverLayProps) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="text-muted-foreground">
            Added on {formatDate(date, "d MMM . K:m")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="text-red-500 focus:text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
              <DropdownMenuShortcut>DEL</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this file from our servers?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="focus:border-none border"
              onClick={onDelete}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type EditTitleProps = {
  setShowEdit: (value: React.SetStateAction<boolean>) => void;
  onChange: (data: { title: string; description: string | null }) => void;
  value: { title: string; description: string | null };
};

function EditTitle({ setShowEdit, onChange, value }: EditTitleProps) {
  const [title, setTitle] = useState(value.title);
  const [desc, setDesc] = useState(value.description);

  const handleSave = () => {
    onChange({ title, description: desc });
    setShowEdit(false);
  };

  return (
    <div className="space-y-3">
      <div className="ring-1 ring-black rounded-lg p-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="focus-visible:ring-transparent w-full h-full p-2 border-none focus:outline-none placeholder:font-medium font-medium focus:border-none"
        />
        <input
          value={desc ? desc : ""}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          className="focus-visible:ring-transparent w-full h-full p-2 border-none focus:outline-none"
        />
      </div>
      <div className="w-full text-right space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEdit(false)}
          className="btn btn-outline btn-sm"
        >
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} className="btn btn-sm">
          Save
        </Button>
      </div>
    </div>
  );
}

interface CommentData {
  content: string;
  userId: string;
  todoId: string;
}

function CommentDisplay({ data }: { data: CommentData }) {
  return (
    <>
      <div className="flex items-start space-x-2 group mt-1 p-2">
        <Avatar className="w-7 h-7 mr-1">
          <div className="bg-black w-full h-full rounded-full" />
        </Avatar>
        <div className="flex-grow">
          <div className="flex items-center justify-between relative">
            <div>
              <span className="font-semibold text-sm">farhan</span>
              <span className="text-xs text-gray-500 ml-2">yesterday</span>
            </div>
            <div className="hidden absolute group-hover:flex right-0 top-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
              >
                <SmilePlus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>{data.content}</div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-gray-500 p-1 h-auto rounded-xl mt-1"
          >
            <>
              <span className="mr-1">🤗</span>
              <span className="mr-1">{2}</span>
            </>
          </Button>
        </div>
      </div>
      <Separator className="flex-grow" />
    </>
  );
}

function CommentInputSection() {
  const user = useRecoilValue(userState);
  const userName = getShortName(user);
  const [comment, setComment] = useState("");

  return (
    <div className="flex gap-2 items-center mt-2">
      <Avatar className="w-7 h-7">
        <AvatarImage src={user?.picture} />
        <AvatarFallback>{userName?.shortName}</AvatarFallback>
      </Avatar>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="absolute right-10 text-muted-foreground"
            size="sm"
          >
            <SmileIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent collisionPadding={50}>
          <EmojiPicker
            height={350}
            onEmojiClick={(emoji) =>
              setComment((preValue) => preValue + emoji.emoji)
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        placeholder="Comment"
        className="flex-grow"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button size="sm">
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default React.memo(TodoDialoge);

import {
  Armchair,
  ArrowRight,
  CalendarIcon,
  CircleSlash,
  CopyIcon,
  Flag,
  FlagIcon,
  LinkIcon,
  PencilIcon,
  Sunrise,
  TrashIcon,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "@/components/ui/context-menu";
import DateCalenderSvg from "@/components/todo-input/DateCalenderSvg";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import DueDateSetterButton from "./todo-input/DueDateSetterButton";
import { TtodoSchema } from "@shared/schemas/todoSchema";
import { ProjectCommandBox } from "./todo-input/ProjectSelectionBox";
import { useRecoilValue } from "recoil";
import { projectList } from "@/store/atom";
import { ReminderPopOver } from "./todo-input/ReminderPopOver";
import { useConditionalKeyboardShortcut } from "@/hooks/keyboard";
import { Link } from "react-router-dom";
const dueDates = [
  { variant: "today", icon: DateCalenderSvg },
  { variant: "tomorrow", icon: Sunrise },
  { variant: "thisWeekend", icon: Armchair },
  { variant: "nextWeek", icon: ArrowRight },
] as const;

type TodoContextMenuProps = {
  setEditTodo: Dispatch<SetStateAction<boolean>>;
  todoId: string;
  todoStateUpdater: (
    id: string,
    update: Partial<TtodoSchema>,
    method?: "delete" | "update"
  ) => Promise<void>;
  projectId: string | null;
  children: ReactNode;
};

export default function TodoContextMenu({
  setEditTodo,
  todoId,
  todoStateUpdater,
  projectId,
  children,
}: TodoContextMenuProps) {
  const [showProjectCommand, setShowProjectCommand] = useState<boolean>(false);
  const projects = useRecoilValue(projectList);
  const [selectedProject, setSelectedProject] = useState("");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  useConditionalKeyboardShortcut(
    "V",
    false,
    () => {
      setShowProjectCommand(true)
      setIsContextMenuOpen(false)
     },
    isContextMenuOpen
  );
  useConditionalKeyboardShortcut(
    "r",
    true,
    () => {
      setShowReminderModal(true)
      setIsContextMenuOpen(false)
     },
    isContextMenuOpen
  );
  useConditionalKeyboardShortcut(
    "e",
    true,
    () => setEditTodo(true),
    isContextMenuOpen
  );

  return (
    <div>
      <ContextMenu onOpenChange={setIsContextMenuOpen}>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        {isContextMenuOpen && <ContextMenuContent className="w-64">
          <ContextMenuItem onSelect={() => setEditTodo(true)}>
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl E
            </span>
          </ContextMenuItem>
          <ContextMenuItem asChild disabled={projectId ? false : true}>
            <Link to={`/project/${projectId}`}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Go to project
              <span className="ml-auto text-xs text-muted-foreground">⌘G</span>
            </Link>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Due date
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="min-w-60">
              {dueDates.map(({ variant, icon }) => (
                <ContextMenuItem key={variant} asChild>
                  <DueDateSetterButton
                    variant={variant}
                    icon={icon}
                    onChnage={(date) =>
                      todoStateUpdater(todoId, { dueDate: date.toISOString() })
                    }
                  />
                </ContextMenuItem>
              ))}
              <ContextMenuItem
                className="font-semibold"
                onSelect={() => todoStateUpdater(todoId, { dueDate: null })}
              >
                <CircleSlash className="w-4 h-4 mr-2 text-muted-foreground ml-0 pl-0 " />
                <div>No date</div>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <FlagIcon className="mr-2 h-4 w-4" />
              Priority
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48 font-semibold">
              <ContextMenuRadioGroup
                value="0"
                onValueChange={(value) =>
                  todoStateUpdater(todoId, { priority: parseInt(value) })
                }
              >
                <ContextMenuRadioItem value="3">
                  <Flag className="fill-red-500 size-4 mr-2" />
                  <span>priority 1</span>
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="2">
                  <Flag className="fill-orange-500 size-4 mr-2" />
                  <span>priority 2</span>
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="1">
                  <Flag className="fill-blue-500 size-4 mr-2" />
                  <span>priority 3</span>
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="0">
                  <Flag className="size-4 mr-2" />
                  <span>priority 4</span>
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={() => setShowReminderModal(true)}>
            Reminders
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl R
            </span>
          </ContextMenuItem>
          <ContextMenuItem disabled>Complete recurring task</ContextMenuItem>
          <ContextMenuItem onSelect={() => setShowProjectCommand(true)}>
            Move to...
            <span className="ml-auto text-xs text-muted-foreground">V</span>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            <CopyIcon className="mr-2 h-4 w-4" />
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem disabled>
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy link to task
            <span className="ml-auto text-xs text-muted-foreground">
              Ctrl C
            </span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="text-red-600"
            onSelect={() => todoStateUpdater(todoId, {}, "delete")}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
            <span className="ml-auto text-xs">Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>}
        
      </ContextMenu>
      {showReminderModal && (
        <ReminderPopOver
          open={showReminderModal}
          onOpenChange={setShowReminderModal}
          onChange={(date) =>
            todoStateUpdater(todoId, { reminder: date.toISOString() })
          }
          type="Model"
        >
          Reminders
        </ReminderPopOver>
      )}
      {showProjectCommand && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <ProjectCommandBox
            onSet={(projectId) =>
              todoStateUpdater(todoId, { projectId: projectId })
            }
            projects={projects}
            value={selectedProject}
            setValue={setSelectedProject}
            setShowProjectCommand={setShowProjectCommand}
            className="rounded-lg border shadow-md w-[90vw] max-w-[400px] h-[50%]"
          />
        </div>
      )}
    </div>
  );
}

import * as React from "react";
import { Check, ChevronsUpDown, Flag, FolderIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRecoilValue } from "recoil";
import { projectList } from "@/store/atom";
import { ProjectTypes } from "@/lib/apiClient";

type ProjectSelectorProps = {
  selectedProjectId?: string | null;
  onSet: (projectId: string | null) => void;
  children?: React.ReactNode;
};

export function ProjectSelector({
  onSet,
  selectedProjectId,
  children,
}: ProjectSelectorProps) {
  const projects = useRecoilValue(projectList);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  React.useEffect(() => {
    if (selectedProjectId) {
      const selectedProject = projects.find(
        (project) => project.id === selectedProjectId
      );
      if (selectedProject) {
        onSet(selectedProject.id);
        setValue(selectedProject.name);
      }
    }
  }, [selectedProjectId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild={children ? false : true}>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? projects.find((project) => project.name === value)?.name
              : "Select project..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <ProjectCommandBox
          projects={projects}
          onSet={onSet}
          value={value}
          setOpen={setOpen}
          setValue={setValue}
        />
      </PopoverContent>
    </Popover>
  );
}
type ProjectCommandBoxProps = {
  projects: ProjectTypes[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onSet: (projectId: string | null) => void;
  value: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowProjectCommand?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string
};

export const ProjectCommandBox = ({
  projects,
  setValue,
  onSet,
  value,
  setOpen,
  setShowProjectCommand,
  className
}: ProjectCommandBoxProps) => {
  return (
    <Command className={cn(className)}>
      <div className="flex items-center border-b px-3">
        <FolderIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          placeholder="Type a command or search..."
          className="flex-1"
        />
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 h-8 w-8"
          onClick={() =>
            setShowProjectCommand
              ? setShowProjectCommand(false)
              : setOpen && setOpen(false)
          }
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      <CommandList>
        <CommandEmpty>No Project found.</CommandEmpty>
        <CommandGroup>
          {projects.map((project) => (
            <CommandItem
              key={project.name}
              value={project.name}
              onSelect={(currentValue) => {
                setValue(currentValue === value ? "" : currentValue);
                onSet(currentValue === value ? null : project.id);
                setOpen && setOpen(false);
                setShowProjectCommand && setShowProjectCommand(false)
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === project.name ? "opacity-100" : "opacity-0"
                )}
              />
              {project.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

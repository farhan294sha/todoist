import React, { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Flag } from "lucide-react";
import { Priority } from "@/utils/color";
type PriorityDropdownProps = {
  children: ReactNode;
  value: Priority;
  onChange: (priority: Priority) => void;
};

const PriorityDropdown = ({
  children,
  value,
  onChange,
}: PriorityDropdownProps) => {
  const handleValueChange = (value: string) => {
    const priorityValue = Priority[value as keyof typeof Priority];
    onChange(priorityValue);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={Priority[value]}
          onValueChange={handleValueChange}
        >
          <DropdownMenuRadioItem value="p1">
            <div className="flex gap-1 text-xs">
              <Flag className="fill-red-500 size-4" />
              <div>Priority 1</div>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="p2">
            <div className="flex gap-1 text-xs">
              <Flag className="fill-orange-500 size-4" />
              <div>Priority 2</div>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="p3">
            <div className="flex gap-1 text-xs">
              <Flag className="fill-blue-500 size-4" />
              <div>Priority 3</div>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="p4">
            <div className="flex gap-1 text-xs">
              <Flag className="size-4" />
              <div>Priority 4</div>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export { PriorityDropdown, PriorityToolTip, PriorityButton };

type PriorityToolTipProps = {
  children: ReactNode;
};

const PriorityToolTip = ({ children }: PriorityToolTipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" className="flex gap-1">
        <div>Set priority</div>
        <div>
          <span className="bg-slate-300 rounded-md text-primary p-1">p1</span>,
        </div>
        <div>
          <span className="bg-slate-300 rounded-md text-primary p-1">p2</span>,
        </div>
        <div>
          <span className="bg-slate-300 rounded-md text-primary p-1">p3</span>,
        </div>
        <div>
          <span className="bg-slate-300 rounded-md text-primary p-1">p4</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const PriorityButton = React.forwardRef<HTMLButtonElement, { value: Priority }>(
  ({ value, ...props }, ref) => {
    let buttonClassName = "text-muted-foreground text-xs p-2";
    let flagColorClassName = "w-3 h-3 mr-2";

    switch (value) {
      case Priority.p1:
        buttonClassName = "text-muted-foreground text-xs p-2";
        flagColorClassName = "w-3 h-3 mr-2 fill-red-500";
        break;
      case Priority.p2:
        buttonClassName = "text-muted-foreground text-xs p-2";
        flagColorClassName = "w-3 h-3 mr-2 fill-orange-500";
        break;
      case Priority.p3:
        buttonClassName = "text-muted-foreground text-xs p-2";
        flagColorClassName = "w-3 h-3 mr-2 fill-blue-500";
        break;
      case Priority.p4:
        buttonClassName = "text-muted-foreground text-xs p-2";
        flagColorClassName = "w-3 h-3 mr-2";
        break;
      default:
        break;
    }

    return (
      <PriorityToolTip>
        <Button
          ref={ref}
          variant="outline"
          size="vsm"
          className={buttonClassName}
          {...props}
        >
          <Flag className={flagColorClassName} />
          {value ? Priority[value] : "Priority"}
          <span className="sr-only">Priority</span>
        </Button>
      </PriorityToolTip>
    );
  }
);

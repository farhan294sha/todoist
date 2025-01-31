import { AlarmClock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ScrollableNumbers from "@/components/todo-input/ScrollTimeSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertTimeComponentsToDate } from "@/utils/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type ReminderPopOverProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  children: ReactNode;
  error?: string;
  type: "Model" | "Popover";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ReminderPopOver = ({
  children,
  onChange,
  type,
  open,
  onOpenChange,
}: ReminderPopOverProps) => {
  const [amPm, setamPm] = useState("AM");
  const [hour, setHours] = useState<number | null>(null);
  const [min, setMin] = useState<number | null>(null);
  useEffect(() => {
    const date = convertTimeComponentsToDate(hour, min, amPm);
    if (!onChange || !date) return;
    onChange(date);
  }, [amPm, hour, min, onChange]);

  if (type === "Model") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Reminder</DialogTitle>
            <DialogDescription>
              Choose a time for your reminder. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 items-center justify-center py-4">
            <ScrollableNumbers
              start={1}
              finish={12}
              value={hour}
              onChange={setHours}
            />
            <div className="font-bold">:</div>
            <ScrollableNumbers
              start={0}
              finish={59}
              value={min}
              onChange={setMin}
            />
            <Select value={amPm} onValueChange={(value) => setamPm(value)}>
              <SelectTrigger className="w-20">
                <SelectValue className="w-20" placeholder={amPm} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange && onOpenChange(false)}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  if (type === "Popover") {
    return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="flex gap-2 flex-col">
          <div>
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Reminder</h4>
              <p className="text-sm text-muted-foreground">
                Set the reminder for todo.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <ScrollableNumbers
              start={1}
              finish={12}
              value={hour}
              onChange={setHours}
            />
            <div className="font-bold">:</div>
            <ScrollableNumbers
              start={0}
              finish={59}
              value={min}
              onChange={setMin}
            />
            <Select
              defaultValue={amPm}
              onValueChange={(value) => setamPm(value)}
            >
              <SelectTrigger className="w-20">
                <SelectValue className="w-20" placeholder={amPm} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
};

type ReminderButtonProps = {
  reminderValue: string | null;
  onChange: (e: null) => void;
};

const ReminderButton = React.forwardRef<HTMLButtonElement, ReminderButtonProps>(
  ({ reminderValue, onChange, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <>
            <Button
              ref={ref}
              variant="outline"
              size="vsm"
              className="text-muted-foreground text-xs p-2"
              {...props}
            >
              <AlarmClock className="w-3 h-3 mr-2" />
              {reminderValue ? (
                <div className="text-amber-600 bg-orange-100 px-2 py-1 rounded">
                  {new Date(reminderValue).toLocaleTimeString()}
                </div>
              ) : (
                <div>Reminder</div>
              )}
              <span className="sr-only">Reminder</span>
            </Button>

            {reminderValue && (
              <Button
                variant="outline"
                size="vsm"
                className="mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  onChange(null);
                }}
              >
                <X className="w-3 h-3 m-2" />
              </Button>
            )}
          </>
        </TooltipTrigger>
        <TooltipContent side="top">Set Reminder</TooltipContent>
      </Tooltip>
    );
  }
);

export { ReminderButton, ReminderPopOver };

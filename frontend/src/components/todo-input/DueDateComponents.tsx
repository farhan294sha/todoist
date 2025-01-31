import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { ReactNode, useEffect, useState } from "react";
import DateCalenderSvg from "@/components/todo-input/DateCalenderSvg";
import { formatDate} from "@/utils/dates";
import { getDateColor } from "@/utils/color";
import {
  Armchair,
  ArrowRight,
  CalendarIcon,
  Sunrise,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TestDayButton } from "@/components/todo-input/CalenderDayButton";
import { format } from "date-fns";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";
import DueDateSetterButton from "./DueDateSetterButton";

type DueDateDropDownProps = {
  valueDate?: string | null;
  onChange?: (date: Date) => void;
  children: ReactNode;
  error?: string;
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left" | undefined
};


const regex =
  /\b(0?[1-9]|[12][0-9]|3[01])\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i;

const dueDates = [
  { variant: "today", icon: DateCalenderSvg },
  { variant: "tomorrow", icon: Sunrise },
  { variant: "thisWeekend", icon: Armchair },
  { variant: "nextWeek", icon: ArrowRight },
] as const;

const DueDateDropDown: React.FC<DueDateDropDownProps> = ({
  children,
  onChange,
  error,
  valueDate,
  asChild = true,
  side = undefined
}) => {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [inputDate, setInputDate] = useState<string>(
    valueDate ? format(valueDate, "dd MMM") : ""
  );

  useEffect(() => {
    if (!inputDate) return;
    if (regex.test(inputDate)) {
      const newDate = new Date(`${inputDate} ${new Date().getFullYear()}`);
      setDate(newDate);
    }
  }, [inputDate]);

  useEffect(() => {
    if (date && onChange) {
      const setDate = date
      if (setDate.setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)) {
        onChange(date);
      } else {
        
      }
    }
  }, [open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputDate(e.target.value);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && regex.test(inputDate)) {
      const newDate = new Date(`${inputDate} ${new Date().getFullYear()}`);
      setDate(newDate);
      setOpen(false);
    }
  }

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DropdownMenuTrigger asChild={asChild}>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-72" sideOffset={-150}>
        <DropdownMenuLabel asChild>
          <input
            type="text"
            className={`border-none focus:outline-none ${
              error ? "border-red-500" : ""
            }`}
            placeholder="Type a due date (31 Jan)"
            value={inputDate}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dueDates.map(({ variant, icon }) => (
          <DropdownMenuItem key={variant} asChild className="flex">
            <DueDateSetterButton
              variant={variant}
              icon={icon}
              setDateSetter={setDate}
              dropDownOpenStateSetter={setOpen}
            />
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          {/* just to ignore the forward refError */}
          <>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selected) => {
                console.log("calender date",selected);
                setDate(selected);
                if (!selected) return;
                setInputDate(format(selected, "dd MMM"));
                setOpen(false);
              }}
              month={date}
              className="rounded-md border"
              disabled={{ before: new Date() }}
              components={{
                DayButton: (props) => <TestDayButton {...props} />,
              }}
            />
          </>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
DueDateDropDown.displayName = "DueDateDropDown";
export { DueDateDropDown, DueDateButton };


type DueDateButtonProps = {
  valueDate: string | null;
  onChange: (e: null) => void;
};

const DueDateButton = React.forwardRef<HTMLButtonElement, DueDateButtonProps>(
  ({ valueDate, onChange, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <>
            <Button
              ref={ref}
              variant="outline"
              size="vsm"
              className={`${
                valueDate ? getDateColor(valueDate) : "text-muted-foreground"
              } ${
                valueDate
                  ? `hover:${getDateColor(valueDate).replace("400", "500")}`
                  : ""
              } text-xs p-2`}
              {...props}
            >
              <CalendarIcon className="w-3 h-3 mr-2" />
              {valueDate ? formatDate(valueDate) : "Due date"}
              <span className="sr-only">Due date</span>
            </Button>
            {valueDate && (
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
        <TooltipContent side="top">Set due date</TooltipContent>
      </Tooltip>
    );
  }
);

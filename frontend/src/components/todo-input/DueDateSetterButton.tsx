import { DateColor } from "@/utils/color";
import { getShortWeekday } from "@/utils/dates";
import { LucideProps } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export interface DateCalendarSvgProps extends Omit<LucideProps, "ref"> {
  date: number;
}

interface DueDateProps {
  variant: "today" | "tomorrow" | "thisWeekend" | "nextWeek";
  date?: Date;
  icon: React.ForwardRefExoticComponent<
    DateCalendarSvgProps & React.RefAttributes<SVGSVGElement>
  >;
  setDateSetter?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  dropDownOpenStateSetter?: React.Dispatch<React.SetStateAction<boolean>>;
  onChnage?: (date: Date) => void
}

const DueDateSetterButton = React.forwardRef<HTMLButtonElement, DueDateProps>(
  (
    { variant, setDateSetter, dropDownOpenStateSetter, date, icon: Icon, onChnage },
    ref
  ) => {
    const currentDate = date || new Date();
    currentDate.setHours(0, 0, 0, 0);
    let day = getShortWeekday(currentDate);

    let content: string;
    let dateColor: DateColor | string;
    let displayDate: string | null = null;

    switch (variant) {
      case "today":
        content = "Today";
        dateColor = DateColor.today;

        break;
      case "tomorrow":
        content = "Tomorrow";
        dateColor = "text-orange-400";
        currentDate.setDate(currentDate.getDate() + 1);
        day = getShortWeekday(currentDate);
        break;
      case "thisWeekend":
        content = "This weekend";
        dateColor = "text-blue-400";
        // Assuming 'Saturday' as this weekend day for simplicity
        currentDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
        day = getShortWeekday(currentDate);
        break;
      case "nextWeek":
        content = "Next week";
        dateColor = DateColor.oneWeek;
        // Assuming 'Next Monday' for simplicity
        currentDate.setDate(currentDate.getDate() + (8 - currentDate.getDay()));
        displayDate = `${getShortWeekday(
          currentDate
        )} ${currentDate.getDate()} ${currentDate.toLocaleString("default", {
          month: "short",
        })}`;
        break;
      default:
        content = "Today";
        dateColor = DateColor.today;
    }

    return (
      <Button
        ref={ref}
        variant="ghost"
        className="w-full flex justify-between"
        onClick={() => {
          onChnage && onChnage(currentDate)
          setDateSetter && setDateSetter(currentDate);
          if (dropDownOpenStateSetter) {
            dropDownOpenStateSetter(false);
          }
        }}
      >
        <div className="flex">
          <Icon
            // this is for custom calendersvg component "DateCalenderSvg"
            date={currentDate.getDate()}
            className={`mr-2 w-5 h-5 ${dateColor}`}
          />
          <span>{content}</span>
        </div>
        <div className="text-muted-foreground">{displayDate ? displayDate : day}</div>
      </Button>
    );
  }
);
export default DueDateSetterButton;

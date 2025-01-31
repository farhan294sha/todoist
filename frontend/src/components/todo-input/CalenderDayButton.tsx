import React from "react";
import { CalendarDay, Modifiers } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useRecoilValue } from "recoil";
import {taskOverdueforPecificDay } from "@/store/selector";
import { cn } from "@/lib/utils";

export function TestDayButton(
  props: {
    /** The day to render. */
    day: CalendarDay;
    /** The modifiers for the day. */
    modifiers: Modifiers;
  } & JSX.IntrinsicElements["button"]
) {
    const { day, modifiers, ...buttonProps } = props;
    const selectedDate = new Date(day.date)

    const todosWithDueDate = useRecoilValue(taskOverdueforPecificDay(selectedDate))

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return modifiers.disabled ? (
      <div >
      <button ref={ref} {...buttonProps} />
    </div>
  ) : (
    <CalenderButtonTooltip numofPendingtask={todosWithDueDate.length}>
      <div className={cn("relative after:absolute after:bg-muted-foreground after:w-1 after:h-1 after:bottom-1 after:rounded-full after:right-[15px]", {
          "after:content-none": todosWithDueDate.length === 0
      }) }>
        <button ref={ref} {...buttonProps} />
      </div>
    </CalenderButtonTooltip>
  );
}

const CalenderButtonTooltip: React.FC<{ children: React.ReactNode, numofPendingtask: number }> = ({
    children,
    numofPendingtask
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
              <p>{numofPendingtask} Task Due</p>
      </TooltipContent>
    </Tooltip>
  );
};
export default CalenderButtonTooltip;

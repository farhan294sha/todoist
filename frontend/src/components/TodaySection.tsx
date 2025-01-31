import { pendingTaskforToday, taskOverdue } from "@/store/selector";
import { CircleCheck } from "lucide-react";
import { useRecoilValue } from "recoil";
import { Separator } from "./ui/separator";
import TodoAccordion, { AccordionVariants } from "./TodoAccordion";
import { AccordionProvider } from "@/context/AccodianContext";

const TodaySection = () => {
  const pendingTodos = useRecoilValue(pendingTaskforToday(new Date()));
  const overDueTodos = useRecoilValue(taskOverdue(new Date()));

  return (
    <>
      <h1 className="font-bold text-2xl">Today</h1>
      <div className="flex items-center mt-2 gap-1 text-muted-foreground">
        <CircleCheck size={16} />
        {pendingTodos} task
      </div>
      <Separator className="mt-2 bg-neutral-400" />
      {overDueTodos.length > 0 && (
        <AccordionProvider variant={AccordionVariants.OverDue}>
          <TodoAccordion />
        </AccordionProvider>
      )}
      <AccordionProvider variant={AccordionVariants.Today}>
        <TodoAccordion showAddTaskButton />
      </AccordionProvider>
    </>
  );
};
export default TodaySection;

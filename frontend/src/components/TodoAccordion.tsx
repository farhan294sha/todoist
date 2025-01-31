import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import CustomAccordionTrigger from "./CustomAccordianTrigger";
import TodoList from "./TodoList";
import React, { Suspense } from "react";
import CenterSpinner from "./Spinner";
import AddTodoButton from "./AddTodoButton";
import { formatDateWithDay } from "@/utils/dates";
import { useAccordionContext } from "@/context/AccodianContext";

export enum AccordionVariants {
  Project = "project",
  OverDue = "overDue",
  Filter = "filter",
  Today = "today",
}

type TodoAccordionProps = {
  showAddTaskButton?: boolean;
};
type AccodianItemsType = {
  accodianName: string;
  buttonClassName?: string;
  buttonContent?: string;
} | null;
const TodoAccordion: React.FC<TodoAccordionProps> = ({
  showAddTaskButton = false,
}) => {
  let accodianItem: AccodianItemsType = null;
  const { variant } = useAccordionContext();

  switch (variant) {
    case AccordionVariants.OverDue:
      accodianItem = {
        accodianName: "Ovderdue",
        buttonClassName: "text-orange-500 bg-white",
        buttonContent: "Reshedule",
      };
      break;
    case AccordionVariants.Today:
      accodianItem = {
        accodianName: formatDateWithDay(),
      };
      break;
    case AccordionVariants.Project:
      return (
        <div className="relative w-full">
          <Suspense fallback={<CenterSpinner />}>
            <TodoList  />
            {showAddTaskButton && <AddTodoButton />}
          </Suspense>
        </div>
      );

    default:
      break;
  }
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <CustomAccordionTrigger
          showButton={accodianItem?.buttonContent ? true : false}
          buttonClassName={accodianItem?.buttonClassName}
          buttonContent={accodianItem?.buttonContent}
          className="bg-white"
        >
          {accodianItem && accodianItem.accodianName}
        </CustomAccordionTrigger>
        <div className="relative w-full">
          <AccordionContent>
            <Suspense fallback={<CenterSpinner />}>
              <TodoList />
              {showAddTaskButton && <AddTodoButton />}
            </Suspense>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};
export default TodoAccordion;

import { Calendar, MessageSquare, Pen } from "lucide-react";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";
import { DueDateDropDown } from "@/components/todo-input/DueDateComponents";

type TodoListEditOptionsProps = {
  openEditTodo: Dispatch<SetStateAction<boolean>>;
  onChangeDate: (date: Date) => void;
  dateValue: string | null
};

const TodoListEditOptions = ({ openEditTodo, onChangeDate, dateValue }: TodoListEditOptionsProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={(e) => {
          e.stopPropagation()
          openEditTodo(true)
        }}
      >
        <Pen size={16} />
      </Button>
      <DueDateDropDown valueDate={dateValue} onChange={(date)=> onChangeDate(date)}>
        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={e => e.stopPropagation()}>
          <Calendar size={16} />
        </Button>
      </DueDateDropDown>

      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <MessageSquare size={16} />
      </Button>
    </>
  );
};
export default TodoListEditOptions;

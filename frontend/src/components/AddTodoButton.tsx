import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import AddTodoInputs from "./todo-input/AddTodoInputs";

const AddTodoButton = () => {
  const [showAddTodo, setShowAddTodo] = useState(false);

  return (
    <div>
      {showAddTodo ? (
        <AddTodoInputs setShowAddTodoInput={setShowAddTodo} />
      ) : (
        <Button
          className="w-full text-muted-foreground group items-center justify-start pt-2"
          variant="ghost"
          onClick={() => setShowAddTodo(true)}
        >
          <Plus className="mr-2 w-4 h-4 group-hover:text-[#E06356] group-hover:stroke-[5px]" />
          <div className="group-hover:text-[#E06356] text-xs">Add Todo</div>
        </Button>
      )}
    </div>
  );
};
export default AddTodoButton;

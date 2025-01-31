import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

interface Messageprops {
  todoId: string;
  commentLength: number;
}

const CommentIcon = ({ todoId, commentLength }: Messageprops) => {
  return (
    <div className="flex items-center gap-1 text-muted-foreground hover:text-accent-foreground">
      <Button variant="iconsm" size="vsm">
        <MessageSquare size={12} />
      </Button>
      <div>{commentLength}</div>
    </div>
  );
};
export default CommentIcon;

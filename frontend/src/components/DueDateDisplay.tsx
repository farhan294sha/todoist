import { getDateColor } from "@/utils/color";
import { formatDate, formatTime, hasTime } from "@/utils/dates";
import { Calendar } from "lucide-react";

interface DueDateDisplayProps {
  dueDate: string;
  done: boolean;
}

const DueDateDisplay: React.FC<DueDateDisplayProps> = ({ dueDate, done }) => {
  return (
    <div className={`flex items-center gap-1 ${!done ? getDateColor(dueDate): "text-muted-foreground"} }`}>
      <div className="flex gap-1 items-center">
        <Calendar size={12} />
        {formatDate(dueDate)}
      </div>
      {hasTime(dueDate) && <div>{formatTime(dueDate)}</div>}
    </div>
  );
};

export default DueDateDisplay;

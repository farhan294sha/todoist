import { Square, SquareCheckBig } from "lucide-react";
import { Button } from "./ui/button";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

type CheakButtonProps = {
  todoDone: boolean;
  pColor: string;
  hColor: string;
  onChange: (e: MouseEvent<HTMLButtonElement>) => void;
  size?: number,
  buttonSize?: "default" | "sm" | "lg" | "icon" | "vsm" | null | undefined,
  className?: string
};

const CheakButton = ({
  todoDone,
  pColor,
  hColor,
  onChange,
  size = 20,
  buttonSize = "icon",
  className
}: CheakButtonProps) => {
  return (
    <Button
      variant="ghost"
      size={buttonSize}
      className={cn(`${pColor} hover:${hColor}`, className)}
      onClick={onChange}
    >
      {todoDone ? (
        <SquareCheckBig
          className="text-muted-foreground fill-muted-foreground"
          fillOpacity={0.2}
          size={size}
        />
      ) : (
        <Square
          className="transition fill-transparent group-hover:fill-current"
          fillOpacity={0.2}
          size={size}
        />
      )}
    </Button>
  );
};
export default CheakButton;

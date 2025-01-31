import { KeyboardEvent } from "react";

const ScrollableNumbers = ({
  start,
  finish,
  value,
  onChange,
}: {
  start: number;
  finish: number;
  value: number | null;
  onChange: (value: number) => void;
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      onChange(value === null ? start : value + 1 > finish ? start : value + 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onChange(
        value === null ? finish : value - 1 < start ? finish : value - 1
      );
    }
  };
  return (
    <div className="flex flex-col items-center" onKeyDown={handleKeyDown}>
      <button
        onClick={() =>
          onChange(
            value === null ? start : value + 1 > finish ? start : value + 1
          )
        }
      >
        ▲
      </button>
      <div className="w-10 text-center">
        {value === null ? "--" : value.toString().padStart(2, "0")}
      </div>
      <button
        onClick={() =>
          onChange(
            value === null ? finish : value - 1 < start ? finish : value - 1
          )
        }
      >
        ▼
      </button>
    </div>
  );
};

export default ScrollableNumbers;

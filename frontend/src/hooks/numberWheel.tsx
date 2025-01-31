import React, { useEffect, useState } from "react";

interface HourState {
  previousHour: number;
  selectedHour: number;
  nextHour: number;
}

interface MinuteState {
  previousMinute: number;
  selectedMinute: number;
  nextMinute: number;
}

enum ScrollDirection {
  UP = "UP",
  DOWN = "DOWN",
  NORMAL = "NORMAL"
}

type useNumberWheelProps = {
  hourWheelRef: React.MutableRefObject<HTMLDivElement | null>;
  minutesWheelRef: React.MutableRefObject<HTMLDivElement | null>;
};

const useNumberWheel = ({
  hourWheelRef,
  minutesWheelRef,
}: useNumberWheelProps) => {
  const [hours, setHours] = useState<HourState>({
    previousHour: 12,
    selectedHour: 1,
    nextHour: 2,
  });
  const [minutes, setMinutes] = useState<MinuteState>({
    previousMinute: 59,
    selectedMinute: 0,
    nextMinute: 1,
  });

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(
    ScrollDirection.UP
  );
  useEffect(() => {
    const hourElement = hourWheelRef.current;
    const minutesElement = minutesWheelRef.current;
    let hoursStateTimer: NodeJS.Timeout;
    let minuteStateTimer: NodeJS.Timeout;

    const handleHourScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        //scroll up
        hoursStateTimer = setTimeout(() => {
          setHours((prevValue) => {
            return updateHours(prevValue, "up");
          });
        }, 350);

        setScrollDirection(ScrollDirection.UP);
      } else {
        hoursStateTimer = setTimeout(() => {
          setHours((prevValue) => {
            return updateHours(prevValue, "down");
          });
        }, 350);

        setScrollDirection(ScrollDirection.DOWN);
      }
    };

    const handleMinScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        //scroll up
        minuteStateTimer = setTimeout(() => {
          setMinutes((prevValue) => {
            return updateMinutes(prevValue, "up");
          });
        }, 300);

        setScrollDirection(ScrollDirection.UP);
      } else {
        minuteStateTimer = setTimeout(() => {
          setMinutes((prevValue) => {
            return updateMinutes(prevValue, "down");
          });
        }, 300);

        setScrollDirection(ScrollDirection.DOWN);
      }
    };

    if (hourElement) {
      // Add the wheel event listener with passive: false
      hourElement.addEventListener("wheel", handleHourScroll, {
        passive: false,
      });
    }
    if (minutesElement) {
      // Add the wheel event listener with passive: false
      minutesElement.addEventListener("wheel", handleMinScroll, {
        passive: false,
      });
    }

    // Clean up the event listener on component unmount
    return () => {
      if (hourElement) {
        hourElement.removeEventListener("wheel", handleHourScroll);
      }
      if (minutesElement) {
        // Add the wheel event listener with passive: false
        minutesElement.removeEventListener("wheel", handleMinScroll);
      }
      clearTimeout(hoursStateTimer);
      clearTimeout(minuteStateTimer);
      setScrollDirection(ScrollDirection.NORMAL)
    };
  }, [hours, minutes]);

  const updateHours = (state: HourState, action: "up" | "down"): HourState => {
    const { previousHour, selectedHour, nextHour } = state;

    if (action === "up") {
      // Move up: shift hours forward
      return {
        previousHour: selectedHour,
        selectedHour: nextHour,
        nextHour: (nextHour % 12) + 1,
      };
    } else if (action === "down") {
      // Move down: shift hours backward
      return {
        previousHour: previousHour - 1 || 12,
        selectedHour: previousHour,
        nextHour: selectedHour,
      };
    }

    return state; // Return unchanged state if action is not 'up' or 'down'
  };
  const updateMinutes = (
    state: MinuteState,
    action: "up" | "down"
  ): MinuteState => {
    const { previousMinute, selectedMinute, nextMinute } = state;

    if (action === "up") {
      // Move up: shift minutes forward
      return {
        previousMinute: selectedMinute,
        selectedMinute: nextMinute,
        nextMinute: (nextMinute + 1) % 60,
      };
    } else if (action === "down") {
      // Move down: shift minutes backward
      return {
        previousMinute: (previousMinute - 1 + 60) % 60,
        selectedMinute: previousMinute,
        nextMinute: selectedMinute,
      };
    }

    return state; // Return unchanged state if action is not 'up' or 'down'
  };

  return { hours, minutes, scrollDirection };
};
export default useNumberWheel;

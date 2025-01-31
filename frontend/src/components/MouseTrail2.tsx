import { useEffect, useRef, useState } from "react";

const MouseTrail2 = () => {
  const [position, setPostion] = useState({ x: 0, y: 0 });
  const courserRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  function handlePosition(e: MouseEvent) {
    const { clientX, clientY } = e;
    if (!courserRef.current) return;

    const divElement = courserRef.current;
    setPostion({
      x: clientX - divElement.offsetWidth / 2,
      y: clientY - divElement.offsetHeight / 2,
    });
  }

  function handleMouseMove(e: MouseEvent) {
    const clickedElement = e.target as HTMLElement;
    const closestElement = clickedElement.closest(".interact");
    if (closestElement != null) {
      setHover(true);
      if (!courserRef.current) return;
      const { top, left, width, height } =
        closestElement.getBoundingClientRect();
      const center = { x: left + width / 2, y: top + height / 2 };
      setPostion({
        x: center.x - courserRef.current?.offsetWidth / 2,
        y: center.y - courserRef.current.offsetHeight / 2,
      });
    } else {
      setHover(false);
    }
    handlePosition(e);
  }
  useEffect(() => {
    if (courserRef.current) {
      const keyframe = {
        transform: `translate(${position.x}px, ${position.y}px) scale(${
          hover ? 6 : 1
        })`,
      };

      courserRef.current.animate([keyframe], {
        duration: 800,
        fill: "forwards",
      });
    }
  }, [position, hover]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={courserRef}
      className="bg-black w-5 h-5 fixed rounded-full top-0 left-0 opacity-0 group-hover:opacity-100 transition-all pointer-events-none"
    ></div>
  );
};
export default MouseTrail2;

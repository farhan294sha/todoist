
import { useState, useEffect, useCallback, useRef } from "react";

interface TrailDot {
  x: number;
  y: number;
  id: number;
}

export default function WebAnimatedMouseTrail() {
  const [isActive, setIsActive] = useState(true);
  const [dots, setDots] = useState<TrailDot[]>([]);
  const requestRef = useRef<number>();
  const coordRef = useRef({ x: 0, y: 0 });

  const animateDots = useCallback(() => {
    setDots((prevDots) => {
      if (prevDots.length < 2) return prevDots; // If not enough dots, no need to animate

      const newDots = prevDots.map((dot, index) => {
        const nextDot = prevDots[index + 1] || prevDots[prevDots.length - 1];

        return {
          ...dot,
          x: dot.x + (nextDot.x - dot.x) * 0.1, // Smooth follow effect
          y: dot.y + (nextDot.y - dot.y ) * 0.1,
        };
      });

      return newDots;
    });

    requestRef.current = requestAnimationFrame(animateDots);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateDots);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animateDots]);

  const addDot = useCallback(
    (x: number, y: number) => {
      if (isActive) {
        const newDotId = Date.now(); // Unique id for each dot
        setDots((prevDots) => [...prevDots.slice(-30), { x, y, id: newDotId }]); // Limit to 50 dots
      }
    },
    [isActive]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      coordRef.current.x = e.clientX;
      coordRef.current.y = e.clientY;
      addDot(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [addDot]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {dots.map((dot, index) => {
          const ratio = index / dots.length; // 0 for the newest dot, 1 for the oldest dot
          const scale = ratio; // Scale decreases from 1 to 0
          const opacity =  ratio; // Opacity decreases from 1 to 0

          return (
            <div
              key={dot.id}
              className="trail-dot"
              style={{
                position: "absolute",
                left: `${dot.x}px`,
                top: `${dot.y}px`,
                width: `150px`,
                height: `150px`,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255, 182, 193, 0.8) 0%, rgba(255, 182, 193, 0) 70%)",
                pointerEvents: "none",
                opacity: opacity,
                transform: `scale(${scale})`,
                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
              }}
            />
          );
        })}
      </div>
      <button
        className="fixed bottom-4 right-4 px-4 py-2 bg-pink-100 text-pink-800 rounded pointer-events-auto focus:outline-none focus:ring-2 focus:ring-pink-300 z-50"
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? "Disable" : "Enable"} Trail
      </button>
    </>
  );
}


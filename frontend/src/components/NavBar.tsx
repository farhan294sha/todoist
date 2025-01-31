import { pendingTaskforToday } from "@/store/selector";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const NavBar = () => {
    const pendingTodo = useRecoilValue(pendingTaskforToday(new Date()))
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
  
        if (scrollPosition >= 100) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  return (
    <div className="flex w-full justify-between h-[52px] items-center px-3 bg-white">
            <div>bread crums</div>
            <div
              className={`duration-300 ease-in-out text-center ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
          >
              <div className="capitalize font-semibold">today</div>
              <div className="text-xs font-normal">{pendingTodo} tasks</div>
            </div>
            <div>view options</div>
          </div>
  )
}
export default NavBar
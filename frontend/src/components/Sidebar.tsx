import { Inbox, LineChart, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Dropdownprofile } from "./DropdownProfile";
import MobileSideBar from "./MobileSideBar";
import DateCalenderSvg from "./todo-input/DateCalenderSvg";
import { useRecoilValue } from "recoil";
import { projectInbox } from "@/store/selector";

const navLinks = [
  {
    to: "/",
    text: "AddTask",
    icon: Plus,
  },
  {
    to: "/",
    text: "Search",
    icon: Search,
  },
  {
    to: "/inbox",
    text: "Inbox",
    icon: Inbox,
  },
  {
    to: "/today",
    text: "Today",
    icon: DateCalenderSvg,
  },
  {
    to: "/",
    text: "Analytics",
    icon: LineChart,
  },
];

export function Dashboard() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Dropdownprofile />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map(({ to, text, icon: Icon }, index) => {
                return (
                  <Link
                    key={index}
                    to={to}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:hover:text-[#E06356]"
                  >
                    <Icon date={new Date().getDate()} className="w-4 h-4" />
                    {text}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <MobileSideBar navLinks={navLinks} />
      </div>
    </div>
  );
}

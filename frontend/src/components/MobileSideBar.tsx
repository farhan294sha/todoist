import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { Dropdownprofile } from "./DropdownProfile";
import { DateCalendarSvgProps } from "./todo-input/DueDateSetterButton";

export interface NavLink {
  to: string;
  text: string;
  icon: React.ForwardRefExoticComponent<
  DateCalendarSvgProps & React.RefAttributes<SVGSVGElement>
>;
}

const MobileSideBar: React.FC<{ navLinks: NavLink[] }> = ({ navLinks }) => {
  return (
    <header className="flex">
      <Sheet>
        <SheetTrigger asChild className="m-2">
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col justify-between">
          <nav className="grid gap-2 text-lg font-medium">
            {navLinks.map(({ to, text, icon: Icon }, index) => (
              <Link
                key={index}
                to={to}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-[#E06356]"
              >
                <Icon date={new Date().getDate()}  className="h-5 w-5" />
                {text}
              </Link>
            ))}
          </nav>
          <Dropdownprofile />
        </SheetContent>
      </Sheet>
    </header>
  );
};
export default MobileSideBar;

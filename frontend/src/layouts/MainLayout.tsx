import NavBar from "@/components/NavBar";
import { Dashboard } from "@/components/Sidebar";
import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {

  return (
    <div className="w-full mx-auto flex justify-around">
      <div className="h-screen sticky top-0">
        <Dashboard />
      </div>
      <section className="w-full flex justify-start flex-col items-center">
        <div className="w-full sticky top-0 z-10">
          <NavBar/>
        </div>
        <div className="w-full md:w-[70%] px-6">{children}</div>
      </section>
    </div>
  );
};
export default MainLayout;

import TodaySection from "./TodaySection";
import ProjectSection from "./ProjectSection";

export enum TodoSectionVariants {
  Project = "project",
  Today = "today",
  Upcomming = "upcomming"

}

type TodoSectionProps = {
  variants: TodoSectionVariants
}

const TodoSection = ({ variants }: TodoSectionProps) => {
  if (variants === TodoSectionVariants.Today) {
   return <TodaySection />
  }
  if (variants === TodoSectionVariants.Project) {
    return <ProjectSection/>
  }
};

export default TodoSection
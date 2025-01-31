import { ProjectTypes } from "@/lib/apiClient";
import { projectWithId } from "@/store/selector";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Separator } from "./ui/separator";
import TodoAccordion, { AccordionVariants } from "./TodoAccordion";
import { AccordionProvider } from "@/context/AccodianContext";

const ProjectSection = () => {
  const { projectId } = useParams<{ projectId?: string }>();

  let project: ProjectTypes | null = null;
  if (projectId) {
    project = useRecoilValue(projectWithId(projectId));
  }

  return (
    <>
      <h1 className="font-bold text-2xl">{project ? project.name : "Inbox"}</h1>
      <Separator className="mt-2 bg-neutral-400" />
      <AccordionProvider variant={AccordionVariants.Project}>
        <TodoAccordion showAddTaskButton />
      </AccordionProvider>
    </>
  );
};
export default ProjectSection;

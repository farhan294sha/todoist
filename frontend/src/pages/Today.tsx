import { lazy, Suspense } from "react";
import CenterSpinner from "@/components/Spinner";
const TodoSection = lazy(() => import("@/components/TodoSection"));
import MainLayout from "@/layouts/MainLayout";
import { TodoSectionVariants } from "@/components/TodoSection";

const Today = () => {
  return (
    <MainLayout>
      <Suspense fallback={<CenterSpinner />}>
        <TodoSection variants={TodoSectionVariants.Today} />
      </Suspense>
    </MainLayout>
  );
};
export default Today;

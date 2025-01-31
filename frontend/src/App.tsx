import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Signin from "./pages/signin";
import { Toaster } from "@/components/ui/toaster";
import Today from "./pages/Today";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import useAuthEffects from "./components/AuthProvider";
import { Suspense } from "react";
import CenterSpinner from "./components/Spinner";
import { TooltipProvider } from "./components/ui/tooltip";
import { Project } from "./pages/Projects";
import { Inbox } from "./pages/Inbox";

function App() {
  useAuthEffects();
  return (
    <BrowserRouter>
      <Suspense fallback={<CenterSpinner />}>
        <TooltipProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Signin />} />
          <Route element={<ProtectedRoutes />}>
              <Route path="/today" element={<Today />} />
              <Route path="/inbox" element={<Inbox />} />
              
            <Route path="/project/:projectId" element={<Project />} />
          </Route>
          </Routes>
          </TooltipProvider>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;

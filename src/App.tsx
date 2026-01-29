import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import AgentLibrary from "./pages/AgentLibrary";
import AgentDetail from "./pages/AgentDetail";
import WorkflowPacks from "./pages/WorkflowPacks";
import WorkflowDetail from "./pages/WorkflowDetail";
import Deployments from "./pages/Deployments";
import GapFinder from "./pages/GapFinder";
import ToolsRegistry from "./pages/ToolsRegistry";
import ToolDetail from "./pages/ToolDetail";
import SkillDetail from "./pages/SkillDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/library" element={<AgentLibrary />} />
            <Route path="/library/:id" element={<AgentDetail />} />
            <Route path="/workflows" element={<WorkflowPacks />} />
            <Route path="/workflows/:id" element={<WorkflowDetail />} />
            <Route path="/deployments" element={<Deployments />} />
            <Route path="/ideas" element={<GapFinder />} />
            <Route path="/tools" element={<ToolsRegistry />} />
            <Route path="/tools/:id" element={<ToolDetail />} />
            <Route path="/tools/skill/:id" element={<SkillDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

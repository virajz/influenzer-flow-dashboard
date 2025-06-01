
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignEdit from "./pages/CampaignEdit";
import CreatorDiscovery from "./pages/CreatorDiscovery";
import OutreachConsole from "./pages/OutreachConsole";
import NegotiationTracker from "./pages/NegotiationTracker";
import PerformanceOverview from "./pages/PerformanceOverview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Layout><Campaigns /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/campaigns/new" element={
              <ProtectedRoute>
                <Layout><CampaignCreate /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/campaigns/:campaignId/edit" element={
              <ProtectedRoute>
                <Layout><CampaignEdit /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/discovery" element={
              <ProtectedRoute>
                <Layout><CreatorDiscovery /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/outreach" element={
              <ProtectedRoute>
                <Layout><OutreachConsole /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/negotiations" element={
              <ProtectedRoute>
                <Layout><NegotiationTracker /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/performance" element={
              <ProtectedRoute>
                <Layout><PerformanceOverview /></Layout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

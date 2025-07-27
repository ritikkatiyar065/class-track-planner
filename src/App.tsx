
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import SubjectDetail from "./pages/SubjectDetail";
import TimetablePage from "./pages/TimetablePage";
import SubjectsPage from "./pages/SubjectsPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import TodoPage from "./pages/TodoPage";
import { FineProvider } from "./contexts/FineContext";
import { TodoProvider } from "./contexts/TodoContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <FineProvider>
            <TodoProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/subjects" element={<SubjectsPage />} />
                  <Route path="/subjects/:id" element={<SubjectDetail />} />
                  <Route path="/timetable" element={<TimetablePage />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/todo" element={<TodoPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TodoProvider>
          </FineProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

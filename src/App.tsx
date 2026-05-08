import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/dashboard";
import { ShiftPage } from "./pages/shifts";
import { CheckpointsPage } from "@/pages/checkpoints";
import { AssignmentsPage } from "@/pages/assignments/AssignmentsPage";
import { IncidentsPage } from "@/pages/incidents/IncidentsPage";
import { ScanAnalyticsPage } from "@/pages/scan-analytics/ScanAnalyticsPage";
import { UsersPage } from "@/pages/UsersPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute allowedRoles={["tenant_admin", "supervisor"]} />
              }
            >
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/shifts" element={<ShiftPage />} />
                <Route path="/checkpoints" element={<CheckpointsPage />} />
                <Route path="/assignments" element={<AssignmentsPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/scan-analytics" element={<ScanAnalyticsPage />} />
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;

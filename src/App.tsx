import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/dashboard";
import { ShiftPage } from "./pages/shifts";
import { CheckpointsPage } from "@/pages/checkpoints";
import { AssignmentsPage } from "@/pages/assignments/AssignmentsPage";
import { IncidentsPage } from "@/pages/incidents/IncidentsPage";
import { AtensiPage } from "@/pages/atensi/AtensiPage";
import { ScanAnalyticsPage } from "@/pages/scan-analytics/ScanAnalyticsPage";
import { LiveAnalyticsPage } from "./pages/live-analytics";
import { UsersPage } from "@/pages/UsersPage";
import { Toaster } from "sonner";
// import MapLive from "./pages/live-analytics/map-live";

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
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "supervisor"]} />
              }
            >
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/live-analytics" element={<LiveAnalyticsPage />} />
                {/* <Route path="/live-analytics/maps" element={<MapLive />} /> */}
                <Route path="/shifts" element={<ShiftPage />} />
                <Route path="/checkpoints" element={<CheckpointsPage />} />
                <Route path="/assignments" element={<AssignmentsPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/atensi" element={<AtensiPage />} />
                <Route path="/scan-analytics" element={<ScanAnalyticsPage />} />
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;

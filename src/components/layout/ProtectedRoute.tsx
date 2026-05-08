import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8 text-primary" />
          <p className="text-[14px] text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-[8px] border border-border bg-card p-6 text-center">
          <h1 className="text-[20px] font-semibold text-foreground">
            Akses Ditolak
          </h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Akun Anda tidak memiliki izin untuk mengakses halaman admin.
          </p>
          <Button className="mt-5" onClick={logout}>
            Kembali ke Login
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

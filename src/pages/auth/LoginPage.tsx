import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success("Login berhasil. Selamat datang!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:flex-col lg:w-[440px] xl:w-[520px] bg-primary p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-[6px] bg-white/20 flex items-center justify-center">
              <Shield className="text-white size-5" />
            </div>
            <div>
              <div className="text-white font-bold text-[18px] leading-tight">SmartPatrol</div>
              <div className="text-white/70 text-[12px]">Security Management System</div>
            </div>
          </div>
          <div className="mt-auto pt-32">
            <h2 className="text-[32px] font-bold text-white leading-[38px] mb-4">
              Kelola Keamanan Lebih Efisien
            </h2>
            <p className="text-white/80 text-[15px] leading-[24px]">
              Platform manajemen patrol keamanan terpadu. Monitor petugas, checkpoint, dan insiden secara real-time.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Checkpoint", value: "600+" },
                { label: "Patrol / Hari", value: "1.2K" },
                { label: "Insiden Terselesaikan", value: "98%" },
                { label: "Uptime", value: "99.9%" },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 rounded-[6px] p-4">
                  <div className="text-[22px] font-bold text-white">{stat.value}</div>
                  <div className="text-[12px] text-white/70 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-[6px] bg-primary flex items-center justify-center">
              <Shield className="text-white size-4" />
            </div>
            <span className="text-[18px] font-bold text-foreground">SmartPatrol</span>
          </div>

          <div className="bg-white rounded-[6px] border border-border p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-[24px] font-bold text-foreground leading-[29px]">Masuk</h1>
              <p className="text-[14px] text-muted-foreground mt-1">Masukkan kredensial akun Anda</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-[14px] font-medium text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@smartpatrol.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className={cn(
                    "h-9 text-[14px]",
                    errors.email && "border-[#FB2C36] focus-visible:ring-[#FB2C36]/20"
                  )}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[12px] text-[#FB2C36]">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-[14px] font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    className={cn(
                      "h-9 text-[14px] pr-10",
                      errors.password && "border-[#FB2C36] focus-visible:ring-[#FB2C36]/20"
                    )}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[12px] text-[#FB2C36]">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-9 bg-primary hover:bg-[#D6522F] text-white font-normal text-[14px]"
              >
                {isSubmitting && <Spinner className="mr-2" />}
                {isSubmitting ? "Masuk..." : "Masuk"}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-3 bg-[#F5F5F5] rounded-[4px] border border-[#E5E5E5]">
              <p className="text-[11px] font-bold text-muted-foreground mb-2">AKUN DEMO</p>
              <div className="space-y-1">
                <p className="text-[12px] text-foreground">
                  <span className="font-medium">Admin:</span> admin@smartpatrol.com / password
                </p>
                <p className="text-[12px] text-foreground">
                  <span className="font-medium">Supervisor:</span> supervisor@smartpatrol.com / password
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

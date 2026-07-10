import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import brandLogo from "/assets/garda-brand.png";

const schema = z.object({
  tenant_id: z.string().min(1, "Tenant ID wajib diisi"),
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tenant_id: "", username: "", password: "" },
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
            <img src={brandLogo} alt="Garda" className="h-10 w-auto" />
          </div>
          <div className="mt-auto pt-32">
            <h2 className="text-[32px] font-bold text-white leading-[38px] mb-4">
              Kelola Keamanan Lebih Efisien
            </h2>
            <p className="text-white/80 text-[15px] leading-[24px]">
              Platform manajemen patrol keamanan terpadu. Monitor petugas,
              checkpoint, dan insiden secara real-time.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Checkpoint", value: "600+" },
                { label: "Patrol / Hari", value: "1.2K" },
                { label: "Insiden Terselesaikan", value: "98%" },
                { label: "Uptime", value: "99.9%" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-[6px] p-4">
                  <div className="text-[22px] font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-[12px] text-white/70 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white/5" />
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src={brandLogo} alt="Garda" className="h-8 w-auto" />
          </div>

          <div className="bg-white rounded-[6px] border border-border p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-[24px] font-bold text-foreground leading-[29px]">
                Masuk
              </h1>
              <p className="text-[14px] text-muted-foreground mt-1">
                Masukkan kredensial akun Anda
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="tenant_id"
                  className="text-[14px] font-medium text-foreground"
                >
                  Tenant ID
                </Label>
                <Input
                  id="tenant_id"
                  type="text"
                  placeholder="nama-perusahaan"
                  autoCapitalize="off"
                  aria-invalid={!!errors.tenant_id}
                  className={cn(
                    "h-9 text-[14px]",
                    errors.tenant_id &&
                      "border-[#FB2C36] focus-visible:ring-[#FB2C36]/20",
                  )}
                  {...register("tenant_id")}
                />
                {errors.tenant_id && (
                  <p className="text-[12px] text-[#FB2C36]">
                    {errors.tenant_id.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="username"
                  className="text-[14px] font-medium text-foreground"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="NIP-88230"
                  autoComplete="username"
                  aria-invalid={!!errors.username}
                  className={cn(
                    "h-9 text-[14px]",
                    errors.username &&
                      "border-[#FB2C36] focus-visible:ring-[#FB2C36]/20",
                  )}
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-[12px] text-[#FB2C36]">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="password"
                  className="text-[14px] font-medium text-foreground"
                >
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
                      errors.password &&
                        "border-[#FB2C36] focus-visible:ring-[#FB2C36]/20",
                    )}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[12px] text-[#FB2C36]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-9 bg-primary hover:bg-primary/80 text-white font-normal text-[14px]"
              >
                {isSubmitting && <Spinner className="mr-2" />}
                {isSubmitting ? "Masuk..." : "Masuk"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

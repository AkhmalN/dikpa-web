import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Variant = "orange" | "green" | "cyan" | "default";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: Variant;
  trend?: { value: number; label: string };
  isLoading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  orange: "bg-[rgba(230,98,57,0.1)] border-[rgba(230,98,57,0.25)]",
  green: "bg-[rgba(0,201,81,0.1)] border-[rgba(0,201,81,0.25)]",
  cyan: "bg-[rgba(0,184,219,0.1)] border-[rgba(0,184,219,0.25)]",
  default: "bg-card border-border",
};

const iconStyles: Record<Variant, string> = {
  orange: "text-[#E66239]",
  green: "text-[#00C951]",
  cyan: "text-[#00B8DB]",
  default: "text-foreground",
};

export function StatCard({ title, value, subtitle, icon, variant = "default", trend, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className={cn("rounded-[6px] border p-6 min-h-[130px] flex flex-col gap-3", variantStyles[variant])}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-[6px] border p-6 min-h-[130px] flex flex-col gap-2 transition-all hover:shadow-sm", variantStyles[variant])}>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground font-medium leading-[15px]">{title}</span>
        {icon && <span className={cn("w-8 h-8 flex items-center justify-center rounded-[6px] bg-white/60", iconStyles[variant])}>{icon}</span>}
      </div>
      <div className="text-[24px] font-bold leading-[29px] text-foreground">{value}</div>
      {subtitle && <div className="text-[12px] text-muted-foreground leading-[15px]">{subtitle}</div>}
      {trend && (
        <div className={cn("text-[11px] font-bold leading-[11px]", trend.value >= 0 ? "text-[#00C951]" : "text-[#FB2C36]")}>
          {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
        </div>
      )}
    </div>
  );
}

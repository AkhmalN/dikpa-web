import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6 ",
        className,
      )}
    >
      <div>
        <h1 className="text-[24px] font-bold leading-[29px] text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-[14px] text-muted-foreground leading-[21px] mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 mt-3 sm:mt-0">{actions}</div>
      )}
    </div>
  );
}

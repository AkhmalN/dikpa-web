import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  bg: string;
  iconColor: string;
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  bg,
  iconColor,
}: StatCardProps) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 ${bg}`}>
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}
        >
          {icon}
        </span>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900 leading-none">
          {value}
        </div>
        {sub && <div className="text-sm text-gray-500 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

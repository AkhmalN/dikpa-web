import { AlertTriangle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { IncidentByTypeItem } from "@/types";

interface IncidentTypeChartProps {
  data: IncidentByTypeItem[] | undefined;
  isLoading: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  THEFT: "Pencurian",
  VANDALISM: "Vandalisme",
  TRESPASSING: "Penyusupan",
  FIRE: "Kebakaran",
  MEDICAL_EMERGENCY: "Medis Darurat",
  SUSPICIOUS_ACTIVITY: "Aktivitas Mencurigakan",
  EQUIPMENT_DAMAGED: "Kerusakan Alat",
  UNAUTHORIZED_ACCESS: "Akses Ilegal",
  OTHER: "Lainnya",
};

export function IncidentTypeChart({ data, isLoading }: IncidentTypeChartProps) {
  const chartData = data?.map((d) => ({
    name:
      TYPE_LABELS[d.type] ??
      d.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    count: d.count,
    rawType: d.type,
  }));

  return (
    <div className="bg-card border border-border rounded-[6px] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground">
            Insiden per Tipe
          </h3>
          <p className="text-[12px] text-muted-foreground">
            Distribusi tipe insiden
          </p>
        </div>
        <AlertTriangle className="size-4 text-[#F0B100]" />
      </div>

      {isLoading ? (
        <Skeleton className="h-52 w-full" />
      ) : !chartData?.length ? (
        <p className="text-[13px] text-muted-foreground text-center py-16">
          Belum ada insiden
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" horizontal />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#525252" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 10, fill: "#525252" }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #E5E5E5",
                fontFamily: "Poppins",
              }}
              formatter={(value: number) => [value, "Insiden"]}
            />
            <Bar dataKey="count" fill="#E66239" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

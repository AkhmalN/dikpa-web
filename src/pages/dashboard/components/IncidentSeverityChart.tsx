import { AlertTriangle } from "lucide-react";
import { Cell, Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { IncidentBySeverityItem } from "@/types";

interface IncidentSeverityChartProps {
  data: IncidentBySeverityItem[] | undefined;
  isLoading: boolean;
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: "#00B8DB",
  MEDIUM: "#F0B100",
  HIGH: "#E66239",
  CRITICAL: "#FB2C36",
};

const SEVERITY_LABELS: Record<string, string> = {
  LOW: "Rendah",
  MEDIUM: "Sedang",
  HIGH: "Tinggi",
  CRITICAL: "Kritis",
};

export function IncidentSeverityChart({
  data,
  isLoading,
}: IncidentSeverityChartProps) {
  const chartData = data?.map((d) => ({
    severity: d.severity,
    count: d.count,
  }));

  return (
    <div className="bg-card border border-border rounded-[6px] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground">
            Insiden per Tingkat
          </h3>
          <p className="text-[12px] text-muted-foreground">
            Distribusi severity
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
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              dataKey="count"
              nameKey="severity"
              paddingAngle={3}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.severity}
                  fill={SEVERITY_COLORS[entry.severity] ?? "#525252"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #E5E5E5",
                fontFamily: "Poppins",
              }}
              formatter={(value: number, name: string) => [
                value,
                SEVERITY_LABELS[name] ?? name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="grid grid-cols-2 gap-2 mt-2">
        {chartData?.map((s) => (
          <div key={s.severity} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: SEVERITY_COLORS[s.severity] ?? "#525252",
              }}
            />
            <span className="text-[11px] text-muted-foreground truncate">
              {SEVERITY_LABELS[s.severity] ?? s.severity}:{" "}
              <strong className="text-foreground">{s.count}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

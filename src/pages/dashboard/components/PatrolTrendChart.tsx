import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { TrendPoint } from "@/types";

interface PatrolTrendChartProps {
  data: TrendPoint[] | undefined;
  isLoading: boolean;
}

export function PatrolTrendChart({ data, isLoading }: PatrolTrendChartProps) {
  return (
    <div className="bg-card border border-border rounded-[6px] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground">
            Tren Patrol
          </h3>
          <p className="text-[12px] text-muted-foreground">Total vs Selesai</p>
        </div>
        <TrendingUp className="size-4 text-primary" />
      </div>

      {isLoading ? (
        <Skeleton className="h-52 w-full" />
      ) : !data?.length ? (
        <p className="text-[13px] text-muted-foreground text-center py-16">
          Belum ada data patrol
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E66239" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#E66239" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="completedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#00B8DB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00B8DB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E5E5"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#525252" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#525252" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #E5E5E5",
                fontFamily: "Poppins",
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#E66239"
              strokeWidth={2}
              fill="url(#totalGradient)"
            />
            <Area
              type="monotone"
              dataKey="completed"
              name="Selesai"
              stroke="#00B8DB"
              strokeWidth={2}
              fill="url(#completedGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <div className="flex items-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-2 rounded-full bg-[#E66239] inline-block" />
          <span className="text-[11px] text-muted-foreground">
            Total Patrol
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-2 rounded-full bg-[#00B8DB] inline-block" />
          <span className="text-[11px] text-muted-foreground">Selesai</span>
        </div>
      </div>
    </div>
  );
}

import { Trophy } from "lucide-react";
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
import type { GuardLeaderboardItem } from "@/types";

interface GuardLeaderboardChartProps {
  data: GuardLeaderboardItem[] | undefined;
  isLoading: boolean;
}

export function GuardLeaderboardChart({
  data,
  isLoading,
}: GuardLeaderboardChartProps) {
  const chartData = data?.map((d) => ({
    name: d.user_name,
    total_patrols: d.total_patrols,
    total_checkpoints: d.total_checkpoints,
  }));

  return (
    <div className="bg-card border border-border rounded-[6px] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground">
            Top 5 Guard
          </h3>
          <p className="text-[12px] text-muted-foreground">
            Patrol terbanyak diselesaikan
          </p>
        </div>
        <Trophy className="size-4 text-[#F0B100]" />
      </div>

      {isLoading ? (
        <Skeleton className="h-52 w-full" />
      ) : !chartData?.length ? (
        <p className="text-[13px] text-muted-foreground text-center py-16">
          Belum ada patrol selesai
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
              formatter={(value: number, name: string) => [
                value,
                name === "total_patrols" ? "Patrol" : "Checkpoint",
              ]}
            />
            <Bar dataKey="total_patrols" fill="#00C951" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

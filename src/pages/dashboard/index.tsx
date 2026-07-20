import {
  Activity,
  AlertTriangle,
  CheckSquare,
  Clock,
  MapPin,
  Shield,
} from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";

import { cn } from "@/lib/utils";
import { useDashboardPage } from "./use-dashboard-page";
import { PatrolTrendChart } from "./components/PatrolTrendChart";
import { IncidentTypeChart } from "./components/IncidentTypeChart";
import { IncidentSeverityChart } from "./components/IncidentSeverityChart";
import { GuardLeaderboardChart } from "./components/GuardLeaderboardChart";
import { PERIODS } from "@/utils/period-filter";

export function DashboardPage() {
  const {
    summary,
    trend,
    incidentStats,
    guardLeaderboard,
    isLoading,
    period,
    setPeriod,
  } = useDashboardPage();
  const patrols = summary?.data.patrols;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="Ringkasan operasional patrol keamanan"
        actions={
          <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-[4px] p-1 border border-border">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  "cursor-pointer px-3 py-1.5 text-[12px] rounded-[4px] font-medium transition-all",
                  period === p.value
                    ? "bg-white text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Patrol"
          value={patrols?.total.toLocaleString() ?? "—"}
          icon={<Shield className="size-4" />}
          variant="orange"
          isLoading={isLoading}
        />
        <StatCard
          title="Completion Rate"
          value={patrols ? `${patrols.completion_rate}%` : "—"}
          icon={<CheckSquare className="size-4" />}
          variant="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Rata-rata Durasi"
          value={
            patrols?.avg_duration_minutes != null
              ? `${patrols.avg_duration_minutes} mnt`
              : "—"
          }
          icon={<Clock className="size-4" />}
          variant="cyan"
          isLoading={isLoading}
        />
        <StatCard
          title="Checkpoint Discan"
          value={patrols?.total_checkpoints_scanned.toLocaleString() ?? "—"}
          icon={<MapPin className="size-4" />}
          variant="orange"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Insiden"
          value={patrols?.total_incidents_reported ?? "—"}
          icon={<AlertTriangle className="size-4" />}
          variant="default"
          isLoading={isLoading}
        />
        <StatCard
          title="Patrol Aktif"
          value={patrols?.active ?? "—"}
          icon={<Activity className="size-4" />}
          variant="green"
          isLoading={isLoading}
        />
      </div>

      {/* Charts row — Tren + Insiden Severity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <PatrolTrendChart data={trend?.data.data} isLoading={isLoading} />
        </div>
        <IncidentSeverityChart
          data={incidentStats?.data.by_severity}
          isLoading={isLoading}
        />
      </div>

      {/* Charts row — Insiden Tipe + Guard Leaderboard */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <IncidentTypeChart
          data={incidentStats?.data.by_type}
          isLoading={isLoading}
        />
        <GuardLeaderboardChart
          data={guardLeaderboard?.data.top_guards}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

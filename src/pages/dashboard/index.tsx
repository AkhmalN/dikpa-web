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
import { PERIODS } from "@/utils/period-filter";

export function DashboardPage() {
  const { data, isLoading, setPeriod, period, refetch } = useDashboardPage();
  const summary = data?.data.patrols;
  const summaryLoading = isLoading;

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
          value={summary?.total.toLocaleString() ?? "—"}
          icon={<Shield className="size-4" />}
          variant="orange"
          isLoading={summaryLoading}
          // trend={{ value: 8.2, label: "vs periode lalu" }}
        />
        <StatCard
          title="Completion Rate"
          value={summary ? `${summary.completion_rate}%` : "—"}
          icon={<CheckSquare className="size-4" />}
          variant="green"
          isLoading={summaryLoading}
          // trend={{ value: 1.5, label: "vs periode lalu" }}
        />
        <StatCard
          title="Rata-rata Durasi"
          value={
            summary?.avg_duration_minutes != null
              ? `${summary.avg_duration_minutes} mnt`
              : "—"
          }
          icon={<Clock className="size-4" />}
          variant="cyan"
          isLoading={summaryLoading}
        />
        <StatCard
          title="Checkpoint Discan"
          value={summary?.total_checkpoints_scanned.toLocaleString() ?? "—"}
          icon={<MapPin className="size-4" />}
          variant="orange"
          isLoading={summaryLoading}
        />
        <StatCard
          title="Total Insiden"
          value={summary?.total_incidents_reported ?? "—"}
          icon={<AlertTriangle className="size-4" />}
          variant="default"
          isLoading={summaryLoading}
          // trend={{ value: -12.3, label: "vs periode lalu" }}
        />
        <StatCard
          title="Patrol Aktif"
          value={summary?.active ?? "—"}
          icon={<Activity className="size-4" />}
          variant="green"
          isLoading={summaryLoading}
          // subtitle="Sedang berjalan"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4">
        {/* Patrol Trend Chart - 2/3 */}
        {/* <div className="xl:col-span-2 bg-card border border-border rounded-[6px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[14px] font-semibold text-foreground">
                Tren Patrol
              </h3>
              <p className="text-[12px] text-muted-foreground">
                Total vs Selesai
              </p>
            </div>
            <TrendingUp className="size-4 text-primary" />
          </div>
          {trendLoading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={trend}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="totalGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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
        </div> */}

        {/* Incident Severity Pie Chart - 1/3 */}
        {/* <div className="bg-card border border-border rounded-[6px] p-6">
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
          {severityLoading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={severityBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="count"
                  nameKey="severity"
                  paddingAngle={3}
                >
                  {severityBreakdown?.map((entry) => (
                    <Cell
                      key={entry.severity}
                      fill={SEVERITY_COLORS[entry.severity]}
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
                  formatter={(value, name) => [
                    value,
                    SEVERITY_LABELS[name as keyof typeof SEVERITY_LABELS]
                      ?.label ?? name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {severityBreakdown?.map((s) => (
              <div key={s.severity} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: SEVERITY_COLORS[s.severity] }}
                />
                <span className="text-[11px] text-muted-foreground truncate">
                  {
                    SEVERITY_LABELS[s.severity as keyof typeof SEVERITY_LABELS]
                      ?.label
                  }
                  : <strong className="text-foreground">{s.count}</strong>
                </span>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Active Patrols */}
        {/* <div className="xl:col-span-1 bg-card border border-border rounded-[6px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-foreground">
              Patrol Aktif
            </h3>
            <span className="flex items-center gap-1.5 text-[11px] text-[#00C951] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00C951] animate-pulse inline-block" />
              LIVE
            </span>
          </div>
          <div className="space-y-3">
            {activeLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : activePatrols?.length === 0 ? (
              <p className="text-[13px] text-muted-foreground text-center py-6">
                Tidak ada patrol aktif
              </p>
            ) : (
              activePatrols?.map((patrol) => (
                <div
                  key={patrol.id}
                  className="flex items-center gap-3 p-3 rounded-[4px] bg-[#F5F5F5] border border-[#E5E5E5]"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="size-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {patrol.guard_name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {patrol.shift_name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[12px] font-bold text-[#E66239]">
                      {patrol.checkpoints_completed}/{patrol.total_checkpoints}
                    </p>
                    <p className="text-[10px] text-muted-foreground">CP</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div> */}

        {/* Recent Incidents */}
        {/* <div className="xl:col-span-2 bg-card border border-border rounded-[6px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-foreground">
              Insiden Terbaru
            </h3>
            <a
              href="/incidents"
              className="text-[12px] text-primary hover:underline"
            >
              Lihat Semua
            </a>
          </div>
          <div className="space-y-3">
            {incidentsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))
              : recentIncidents?.map((inc) => {
                  const statusCfg =
                    INCIDENT_STATUS_LABELS[
                      inc.status as keyof typeof INCIDENT_STATUS_LABELS
                    ];
                  const severityCfg =
                    SEVERITY_LABELS[
                      inc.severity as keyof typeof SEVERITY_LABELS
                    ];
                  return (
                    <div
                      key={inc.id}
                      className="flex items-center gap-4 py-3 border-b border-[#E5E5E5] last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-foreground truncate">
                          {inc.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {inc.reporter_name} ·{" "}
                          {format(parseISO(inc.occurred_at), "dd MMM, HH:mm", {
                            locale: localeId,
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-[800px] px-2.5 py-0.5 text-[10px] font-bold border",
                            severityCfg?.className,
                          )}
                        >
                          {severityCfg?.label}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-[800px] px-2.5 py-0.5 text-[10px] font-bold border",
                            statusCfg?.className,
                          )}
                        >
                          {statusCfg?.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div> */}
      </div>

      {/* Top Checkpoints */}
      <div className="bg-card border border-border rounded-[6px] p-6">
        {/* <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">
              Top Checkpoint
            </h3>
            <p className="text-[12px] text-muted-foreground">
              Berdasarkan jumlah scan
            </p>
          </div>
          <MapPin className="size-4 text-muted-foreground" />
        </div> */}
        {/* <div className="space-y-3">
          {topCheckpoints?.map((cp, idx) => {
            const maxScans = topCheckpoints[0]?.total_scans ?? 1;
            const pct = Math.round((cp.total_scans / maxScans) * 100);
            return (
              <div key={cp.checkpoint_id} className="flex items-center gap-3">
                <span className="w-5 text-[12px] font-bold text-muted-foreground text-right flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium text-foreground truncate">
                      {cp.checkpoint_name}
                    </span>
                    <span className="text-[12px] font-bold text-primary flex-shrink-0 ml-2">
                      {cp.total_scans.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  );
}

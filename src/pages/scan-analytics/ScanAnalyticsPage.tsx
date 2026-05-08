import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { BarChart2, MapPin, ScanLine, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { scanAnalyticsService } from "@/services/scan-analytics.service";
import type { CheckpointScanStat } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";

export function ScanAnalyticsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["scan-analytics", page, search],
    queryFn: () => scanAnalyticsService.getCheckpointRankings({ page: page + 1, per_page: PER_PAGE, search }),
    placeholderData: (prev) => prev,
  });

  const totalScans = data?.data.reduce((sum, r) => sum + r.total_scans, 0) ?? 0;
  const maxScans = data?.data[0]?.total_scans ?? 1;

  const columns: ColumnDef<CheckpointScanStat>[] = [
    {
      id: "rank",
      header: "#",
      cell: ({ row }) => (
        <span className="text-[13px] font-bold text-muted-foreground w-6 inline-block text-center">
          {(page * PER_PAGE) + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "checkpoint_name",
      header: "Checkpoint",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[4px] bg-[rgba(0,184,219,0.1)] flex items-center justify-center flex-shrink-0">
            <MapPin className="size-3.5 text-[#00B8DB]" />
          </div>
          <span className="font-medium text-foreground text-[13px]">{row.original.checkpoint_name}</span>
        </div>
      ),
    },
    {
      accessorKey: "total_scans",
      header: "Total Scan",
      cell: ({ row }) => {
        const pct = maxScans > 0 ? (row.original.total_scans / maxScans) * 100 : 0;
        return (
          <div className="flex items-center gap-3 min-w-[160px]">
            <span className="text-[13px] font-semibold text-foreground w-8 text-right shrink-0">
              {row.original.total_scans}
            </span>
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00B8DB] rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground w-8 shrink-0">{pct.toFixed(0)}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "unique_scanners",
      header: "Petugas Unik",
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground">{row.original.unique_scanners}</span>
      ),
    },
    {
      accessorKey: "last_scanned_at",
      header: "Terakhir Discan",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">
          {row.original.last_scanned_at
            ? format(parseISO(row.original.last_scanned_at), "dd MMM yy, HH:mm", { locale: localeId })
            : "—"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Scan Analytics"
        description="Analitik pemindaian checkpoint patroli"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Scan"
          value={totalScans.toLocaleString()}
          icon={<ScanLine className="size-5" />}
          variant="cyan"
          isLoading={isLoading}
        />
        <StatCard
          title="Checkpoint Aktif"
          value={data?.total ?? 0}
          icon={<MapPin className="size-5" />}
          variant="default"
          isLoading={isLoading}
        />
        <StatCard
          title="Scan Tertinggi"
          value={maxScans.toLocaleString()}
          icon={<TrendingUp className="size-5" />}
          variant="orange"
          subtitle={data?.data[0]?.checkpoint_name}
          isLoading={isLoading}
        />
        <StatCard
          title="Rata-rata Scan"
          value={data?.data.length ? Math.round(totalScans / data.data.length).toLocaleString() : "0"}
          icon={<BarChart2 className="size-5" />}
          variant="green"
          isLoading={isLoading}
        />
      </div>

      <div className="bg-card border border-border rounded-[6px] p-6">
        <div className="mb-4">
          <h2 className="text-[15px] font-semibold text-foreground">Ranking Checkpoint</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">Diurutkan berdasarkan jumlah scan terbanyak</p>
        </div>
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          totalItems={data?.total}
          searchPlaceholder="Cari checkpoint..."
          onSearchChange={(v) => { setSearch(v); setPage(0); }}
          searchValue={search}
          pagination={{ pageIndex: page, pageSize: PER_PAGE, pageCount: data?.total_pages ?? 1, onPageChange: setPage }}
          emptyMessage="Tidak ada data scan analytics."
        />
      </div>
    </div>
  );
}

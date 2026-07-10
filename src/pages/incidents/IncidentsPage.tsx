import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useIncidentsQuery } from "@/hooks/use-incident-query";
import {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  type Incident,
} from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, StatusBadge } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SecureImage } from "./components/SecureImage";

const STATUS_LABELS: Record<
  IncidentStatus,
  { label: string; className: string }
> = {
  [IncidentStatus.OPEN]: {
    label: "Terbuka",
    className:
      "bg-[rgba(251,44,54,0.15)] text-[#FB2C36] border-[rgba(251,44,54,0.3)]",
  },
  [IncidentStatus.IN_PROGRESS]: {
    label: "Dalam Proses",
    className:
      "bg-[rgba(240,177,0,0.15)] text-[#F0B100] border-[rgba(240,177,0,0.3)]",
  },
  [IncidentStatus.RESOLVED]: {
    label: "Selesai",
    className:
      "bg-[rgba(0,201,81,0.15)] text-[#00C951] border-[rgba(0,201,81,0.3)]",
  },
};

const SEVERITY_LABELS: Record<
  IncidentSeverity,
  { label: string; className: string }
> = {
  [IncidentSeverity.CRITICAL]: {
    label: "Kritis",
    className:
      "bg-[rgba(251,44,54,0.15)] text-[#FB2C36] border-[rgba(251,44,54,0.3)]",
  },
  [IncidentSeverity.HIGH]: {
    label: "Tinggi",
    className:
      "bg-[rgba(230,98,57,0.15)] text-[#E66239] border-[rgba(230,98,57,0.3)]",
  },
  [IncidentSeverity.MEDIUM]: {
    label: "Sedang",
    className:
      "bg-[rgba(240,177,0,0.15)] text-[#F0B100] border-[rgba(240,177,0,0.3)]",
  },
  [IncidentSeverity.LOW]: {
    label: "Rendah",
    className:
      "bg-[rgba(0,201,81,0.15)] text-[#00C951] border-[rgba(0,201,81,0.3)]",
  },
};

const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  [IncidentType.THEFT]: "Pencurian",
  [IncidentType.VANDALISM]: "Vandalisme",
  [IncidentType.TRESPASSING]: "Penyusupan",
  [IncidentType.FIRE]: "Kebakaran",
  [IncidentType.MEDICAL_EMERGENCY]: "Darurat Medis",
  [IncidentType.SUSPICIOUS_ACTIVITY]: "Aktivitas Mencurigakan",
  [IncidentType.EQUIPMENT_DAMAGED]: "Peralatan Rusak",
  [IncidentType.UNAUTHORIZED_ACCESS]: "Akses Tidak Sah",
  [IncidentType.OTHER]: "Lainnya",
};

export function IncidentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [detailIncident, setDetailIncident] = useState<Incident | null>(null);
  const PER_PAGE = 10;

  const dataQuery = useIncidentsQuery({
    page,
    perPage: PER_PAGE,
    search,
    ...(statusFilter !== "all"
      ? { status: statusFilter as IncidentStatus }
      : {}),
    ...(severityFilter !== "all"
      ? { severity: severityFilter as IncidentSeverity }
      : {}),
  });

  const openIncidentCount = useMemo(
    () =>
      (dataQuery.data?.data ?? []).filter(
        (incident) => incident.status === IncidentStatus.OPEN,
      ).length,
    [dataQuery.data?.data],
  );

  const columns: ColumnDef<Incident>[] = [
    {
      accessorKey: "incident_type",
      header: "Tipe Insiden",
      cell: ({ row }) => (
        <div className="max-w-60">
          <p className="font-medium text-foreground text-[13px] line-clamp-2">
            {INCIDENT_TYPE_LABELS[row.original.incident_type]}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "severity",
      header: "Tingkat",
      cell: ({ row }) => (
        <StatusBadge status={row.original.severity} labels={SEVERITY_LABELS} />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} labels={STATUS_LABELS} />
      ),
    },
    {
      accessorKey: "reported_by",
      header: "Dilaporkan Oleh",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">
          {row.original.reported_by}
        </span>
      ),
    },
    {
      accessorKey: "reported_at",
      header: "Waktu Kejadian",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">
          {format(row.original.reported_at, "dd MMM yy, HH:mm", {
            locale: localeId,
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            onClick={() => setDetailIncident(row.original)}
          >
            <Eye className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filterComponent = (
    <div className="flex items-center gap-2">
      <Select
        value={statusFilter}
        onValueChange={(value) => {
          setStatusFilter(value);
          setPage(0);
        }}
      >
        <SelectTrigger className="w-36 h-9 text-[13px]">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value={IncidentStatus.OPEN}>Terbuka</SelectItem>
          <SelectItem value={IncidentStatus.IN_PROGRESS}>
            Dalam Proses
          </SelectItem>
          <SelectItem value={IncidentStatus.RESOLVED}>Selesai</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={severityFilter}
        onValueChange={(value) => {
          setSeverityFilter(value);
          setPage(0);
        }}
      >
        <SelectTrigger className="w-36 h-9 text-[13px]">
          <SelectValue placeholder="Semua Tingkat" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Tingkat</SelectItem>
          <SelectItem value={IncidentSeverity.CRITICAL}>Kritis</SelectItem>
          <SelectItem value={IncidentSeverity.HIGH}>Tinggi</SelectItem>
          <SelectItem value={IncidentSeverity.MEDIUM}>Sedang</SelectItem>
          <SelectItem value={IncidentSeverity.LOW}>Rendah</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Incidents"
        description="Monitor dan kelola insiden keamanan"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(251,44,54,0.08)] border border-[rgba(251,44,54,0.2)] rounded-lg">
              <AlertTriangle className="size-3.5 text-[#FB2C36]" />
              <span className="text-[12px] font-medium text-[#FB2C36]">
                {openIncidentCount} Terbuka
              </span>
            </div>
          </div>
        }
      />

      <div className="bg-card border border-border rounded-[6px] p-6">
        <DataTable
          columns={columns}
          data={dataQuery.data?.data ?? []}
          isLoading={dataQuery.isLoading}
          totalItems={dataQuery.data?.meta.total}
          searchPlaceholder="Cari insiden..."
          onSearchChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
          searchValue={search}
          filterComponent={filterComponent}
          pagination={{
            pageIndex: page,
            pageSize: PER_PAGE,
            pageCount: dataQuery.data?.meta.totalPages ?? 1,
            onPageChange: setPage,
          }}
          emptyMessage="Tidak ada insiden yang ditemukan."
        />
      </div>

      <Dialog
        open={!!detailIncident}
        onOpenChange={(open) => {
          if (!open) setDetailIncident(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Insiden</DialogTitle>
          </DialogHeader>
          {detailIncident && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[6px] bg-[rgba(251,44,54,0.1)] flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-5 text-[#FB2C36]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-foreground">
                    {INCIDENT_TYPE_LABELS[detailIncident.incident_type]}
                  </h3>
                  <p className="text-[13px] text-muted-foreground mt-1">
                    {detailIncident.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Tingkat",
                    value: (
                      <StatusBadge
                        status={detailIncident.severity}
                        labels={SEVERITY_LABELS}
                      />
                    ),
                  },
                  {
                    label: "Status",
                    value: (
                      <StatusBadge
                        status={detailIncident.status}
                        labels={STATUS_LABELS}
                      />
                    ),
                  },
                  {
                    label: "Dilaporkan Oleh",
                    value: detailIncident.reported_by,
                  },
                  { label: "Tenant", value: detailIncident.tenant_id },
                  {
                    label: "Patrol Log ID",
                    value: detailIncident.patrol_log_id,
                  },
                  {
                    label: "Waktu Kejadian",
                    value: format(
                      detailIncident.reported_at,
                      "dd MMM yyyy, HH:mm",
                      {
                        locale: localeId,
                      },
                    ),
                  },
                  { label: "ID Insiden", value: detailIncident._id },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">
                      {row.label}
                    </span>
                    <span className="text-[14px] text-foreground">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              {detailIncident.upload_paths.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="size-4 text-muted-foreground" />
                    <span className="text-[12px] font-bold text-muted-foreground uppercase">
                      Bukti Upload ({detailIncident.upload_paths.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-auto">
                    {detailIncident.upload_paths.map((path) => {
                      const baseUrl =
                        import.meta.env.VITE_APP_R2_PUBLIC_URL;
                      const imageUrl = `${baseUrl}/${path}`;
                      return (
                        <div
                          key={path}
                          className="rounded-md border border-border overflow-hidden bg-muted flex flex-col"
                        >
                          <img
                            src={imageUrl}
                            alt="Bukti insiden"
                            loading="lazy"
                            className="w-full h-24 object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

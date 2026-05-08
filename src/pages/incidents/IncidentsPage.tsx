import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { incidentsService } from "@/services/incidents.service";
import type { Incident, IncidentStatus } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, StatusBadge } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const STATUS_LABELS = {
  OPEN: { label: "Terbuka", className: "bg-[rgba(251,44,54,0.15)] text-[#FB2C36] border-[rgba(251,44,54,0.3)]" },
  IN_PROGRESS: { label: "Dalam Proses", className: "bg-[rgba(240,177,0,0.15)] text-[#F0B100] border-[rgba(240,177,0,0.3)]" },
  RESOLVED: { label: "Selesai", className: "bg-[rgba(0,201,81,0.15)] text-[#00C951] border-[rgba(0,201,81,0.3)]" },
};

const SEVERITY_LABELS = {
  CRITICAL: { label: "Kritis", className: "bg-[rgba(251,44,54,0.15)] text-[#FB2C36] border-[rgba(251,44,54,0.3)]" },
  HIGH: { label: "Tinggi", className: "bg-[rgba(230,98,57,0.15)] text-[#E66239] border-[rgba(230,98,57,0.3)]" },
  MEDIUM: { label: "Sedang", className: "bg-[rgba(240,177,0,0.15)] text-[#F0B100] border-[rgba(240,177,0,0.3)]" },
  LOW: { label: "Rendah", className: "bg-[rgba(0,201,81,0.15)] text-[#00C951] border-[rgba(0,201,81,0.3)]" },
};

const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
  resolution_note: z.string().optional(),
});
type UpdateStatusForm = z.infer<typeof updateStatusSchema>;

export function IncidentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [detailIncident, setDetailIncident] = useState<Incident | null>(null);
  const [updateStatusTarget, setUpdateStatusTarget] = useState<Incident | null>(null);
  const PER_PAGE = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["incidents", page, search, statusFilter, severityFilter],
    queryFn: () => incidentsService.getList({
      page: page + 1,
      per_page: PER_PAGE,
      search,
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(severityFilter !== "all" ? { severity: severityFilter } : {}),
    }),
    placeholderData: (prev) => prev,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: IncidentStatus; resolution_note?: string } }) =>
      incidentsService.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-recent-incidents"] });
      toast.success("Status insiden berhasil diperbarui!");
      setUpdateStatusTarget(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { control, handleSubmit, reset } = useForm<UpdateStatusForm>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: { status: "OPEN", resolution_note: "" },
  });

  const openUpdateStatus = useCallback((inc: Incident) => {
    reset({ status: inc.status, resolution_note: "" });
    setUpdateStatusTarget(inc);
  }, [reset]);

  const onSubmitStatus = (data: UpdateStatusForm) => {
    if (updateStatusTarget) {
      updateMutation.mutate({ id: updateStatusTarget.id, payload: { status: data.status, resolution_note: data.resolution_note } });
    }
  };

  const columns: ColumnDef<Incident>[] = [
    {
      accessorKey: "title",
      header: "Judul Insiden",
      cell: ({ row }) => (
        <div className="max-w-[240px]">
          <p className="font-medium text-foreground text-[13px] line-clamp-2">{row.original.title}</p>
          {row.original.location && <p className="text-[11px] text-muted-foreground mt-0.5">{row.original.location}</p>}
        </div>
      ),
    },
    {
      accessorKey: "severity",
      header: "Tingkat",
      cell: ({ row }) => <StatusBadge status={row.original.severity} labels={SEVERITY_LABELS} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} labels={STATUS_LABELS} />,
    },
    {
      accessorKey: "reporter_name",
      header: "Dilaporkan Oleh",
      cell: ({ row }) => <span className="text-[13px] text-muted-foreground">{row.original.reporter_name || "—"}</span>,
    },
    {
      accessorKey: "occurred_at",
      header: "Waktu Kejadian",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">
          {format(parseISO(row.original.occurred_at), "dd MMM yy, HH:mm", { locale: localeId })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" className="h-7 w-7" onClick={() => setDetailIncident(row.original)}>
            <Eye className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[11px] px-2"
            onClick={() => openUpdateStatus(row.original)}
          >
            Update Status
          </Button>
        </div>
      ),
    },
  ];

  const filterComponent = (
    <div className="flex items-center gap-2">
      <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
        <SelectTrigger className="w-36 h-9 text-[13px]">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="OPEN">Terbuka</SelectItem>
          <SelectItem value="IN_PROGRESS">Dalam Proses</SelectItem>
          <SelectItem value="RESOLVED">Selesai</SelectItem>
        </SelectContent>
      </Select>
      <Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setPage(0); }}>
        <SelectTrigger className="w-36 h-9 text-[13px]">
          <SelectValue placeholder="Semua Tingkat" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Tingkat</SelectItem>
          <SelectItem value="CRITICAL">Kritis</SelectItem>
          <SelectItem value="HIGH">Tinggi</SelectItem>
          <SelectItem value="MEDIUM">Sedang</SelectItem>
          <SelectItem value="LOW">Rendah</SelectItem>
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
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(251,44,54,0.08)] border border-[rgba(251,44,54,0.2)] rounded-[4px]">
              <AlertTriangle className="size-3.5 text-[#FB2C36]" />
              <span className="text-[12px] font-medium text-[#FB2C36]">
                {data?.data.filter(i => i.status === "OPEN").length ?? 0} Terbuka
              </span>
            </div>
          </div>
        }
      />

      <div className="bg-card border border-border rounded-[6px] p-6">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          totalItems={data?.total}
          searchPlaceholder="Cari insiden..."
          onSearchChange={(v) => { setSearch(v); setPage(0); }}
          searchValue={search}
          filterComponent={filterComponent}
          pagination={{ pageIndex: page, pageSize: PER_PAGE, pageCount: data?.total_pages ?? 1, onPageChange: setPage }}
          emptyMessage="Tidak ada insiden yang ditemukan."
        />
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailIncident} onOpenChange={(open) => { if (!open) setDetailIncident(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Detail Insiden</DialogTitle></DialogHeader>
          {detailIncident && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[6px] bg-[rgba(251,44,54,0.1)] flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="size-5 text-[#FB2C36]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-foreground">{detailIncident.title}</h3>
                  <p className="text-[13px] text-muted-foreground mt-1">{detailIncident.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Tingkat", value: <StatusBadge status={detailIncident.severity} labels={SEVERITY_LABELS} /> },
                  { label: "Status", value: <StatusBadge status={detailIncident.status} labels={STATUS_LABELS} /> },
                  { label: "Dilaporkan Oleh", value: detailIncident.reporter_name || "—" },
                  { label: "Lokasi", value: detailIncident.location || "—" },
                  { label: "Checkpoint", value: detailIncident.checkpoint_name || "—" },
                  { label: "Waktu Kejadian", value: format(parseISO(detailIncident.occurred_at), "dd MMM yyyy, HH:mm", { locale: localeId }) },
                  ...(detailIncident.resolved_at ? [{ label: "Diselesaikan", value: format(parseISO(detailIncident.resolved_at), "dd MMM yyyy, HH:mm", { locale: localeId }) }] : []),
                ].map(row => (
                  <div key={row.label} className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">{row.label}</span>
                    <span className="text-[14px] text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
              <Button
                className="mt-2 bg-primary hover:bg-[#D6522F] text-white"
                onClick={() => { setDetailIncident(null); openUpdateStatus(detailIncident); }}
              >
                Update Status
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <FormModal
        open={!!updateStatusTarget}
        onOpenChange={(open) => { if (!open) setUpdateStatusTarget(null); }}
        title="Update Status Insiden"
        onSubmit={handleSubmit(onSubmitStatus)}
        isSubmitting={updateMutation.isPending}
        submitLabel="Perbarui Status"
        size="sm"
      >
        <div className="p-3 bg-[#F5F5F5] rounded-[4px] border border-[#E5E5E5] mb-2">
          <p className="text-[13px] font-medium text-foreground line-clamp-2">{updateStatusTarget?.title}</p>
        </div>
        <Controller name="status" control={control} render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label>Status Baru <span className="text-[#FB2C36]">*</span></Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Terbuka</SelectItem>
                <SelectItem value="IN_PROGRESS">Dalam Proses</SelectItem>
                <SelectItem value="RESOLVED">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )} />
        <Controller name="resolution_note" control={control} render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label>Catatan Penyelesaian</Label>
            <Textarea {...field} placeholder="Tambahkan catatan penyelesaian..." className="min-h-[80px]" />
          </div>
        )} />
      </FormModal>
    </div>
  );
}

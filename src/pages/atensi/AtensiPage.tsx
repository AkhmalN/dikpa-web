import { Controller } from "react-hook-form";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";
import { useAtensiPage } from "./use-atensi-page";

export function AtensiPage() {
  const {
    columns,
    data,
    totalItems,
    pageCount,
    page,
    modalMode,
    selectedAtensi,
    deleteTarget,
    detailRows,
    isLoading,
    isSubmitting,
    isDeleting,
    form,
    openCreate,
    closeModal,
    setPage,
    setDeleteTarget,
    handleSubmit,
    confirmDelete,
    shifts,
    checkpoints,
    shiftsLoading,
    checkpointsLoading,
  } = useAtensiPage();

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div>
      <PageHeader
        title="Atensi"
        description="Kelola atensi / instruksi khusus untuk petugas keamanan"
        actions={
          <Button
            onClick={openCreate}
            className="bg-primary hover:bg-primary/80 text-white h-9"
          >
            <Plus className="size-4 mr-1.5" /> Tambah Atensi
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-[6px] p-6">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          totalItems={totalItems}
          pagination={{
            pageIndex: page,
            pageSize: 10,
            pageCount,
            onPageChange: setPage,
          }}
          emptyMessage="Belum ada atensi. Klik 'Tambah Atensi' untuk memulai."
        />
      </div>

      <FormModal
        open={modalMode === "create" || modalMode === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
        title={modalMode === "create" ? "Tambah Atensi Baru" : "Edit Atensi"}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={
          modalMode === "create" ? "Simpan Atensi" : "Perbarui Atensi"
        }
        size="lg"
      >
        <Controller
          name="shift_id"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="shift_id">
                Shift <span className="text-[#FB2C36]">*</span>
              </Label>
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={shiftsLoading}
              >
                <SelectTrigger
                  id="shift_id"
                  aria-invalid={!!errors.shift_id}
                  className={cn(
                    "w-full",
                    errors.shift_id && "border-[#FB2C36]",
                  )}
                >
                  <SelectValue placeholder="Pilih shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.shift_name} ({s.shift_start_time} - {s.shift_end_time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.shift_id && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.shift_id.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="checkpoint_id"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkpoint_id">Checkpoint</Label>
              <Select
                value={field.value ?? "all"}
                onValueChange={(v) => field.onChange(v === "all" ? null : v)}
                disabled={checkpointsLoading}
              >
                <SelectTrigger id="checkpoint_id" className="w-full">
                  <SelectValue placeholder="Semua Checkpoint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Checkpoint</SelectItem>
                  {checkpoints.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">
                Judul <span className="text-[#FB2C36]">*</span>
              </Label>
              <Input
                {...field}
                id="title"
                placeholder="Masukkan judul atensi"
                aria-invalid={!!errors.title}
                className={cn(errors.title && "border-[#FB2C36]")}
              />
              {errors.title && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.title.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">
                Deskripsi <span className="text-[#FB2C36]">*</span>
              </Label>
              <Textarea
                {...field}
                id="description"
                rows={4}
                placeholder="Masukkan deskripsi atensi"
                aria-invalid={!!errors.description}
                className={cn(errors.description && "border-[#FB2C36]")}
              />
              {errors.description && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.description.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="photo_url"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="photo_url">URL Foto</Label>
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
                id="photo_url"
                placeholder="Masukkan URL foto (opsional)"
              />
            </div>
          )}
        />

        <Controller
          name="expires_at"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expires_at">
                Kadaluarsa <span className="text-[#FB2C36]">*</span>
              </Label>
              <Input
                {...field}
                id="expires_at"
                type="datetime-local"
                aria-invalid={!!errors.expires_at}
                className={cn(errors.expires_at && "border-[#FB2C36]")}
              />
              {errors.expires_at && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.expires_at.message}
                </p>
              )}
            </div>
          )}
        />
      </FormModal>

      <Dialog
        open={modalMode === "detail"}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Detail Atensi</DialogTitle>
          </DialogHeader>
          {selectedAtensi && (
            <div className="flex flex-col gap-4 py-2">
              {detailRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                    {row.label}
                  </span>
                  <span className="text-[14px] text-foreground wrap-break-word">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Atensi"
        description={`Apakah Anda yakin ingin menghapus atensi "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}

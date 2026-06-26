import { Controller } from "react-hook-form";
import { Plus, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { MapPicker } from "@/components/shared/MapPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCheckpointPage } from "./use-checkpoint-page";

export function CheckpointsPage() {
  const {
    columns,
    data,
    totalItems,
    pageCount,
    page,
    perPage,
    search,
    modalMode,
    selected,
    deleteTarget,
    detailRows,
    isLoading,
    isSubmitting,
    isDeleting,
    control,
    errors,
    watchedLat,
    watchedLon,
    setValue,
    openCreate,
    openEdit,
    closeModal,
    setPage,
    setSearch,
    setDeleteTarget,
    handleSubmit,
    confirmDelete,
  } = useCheckpointPage();

  return (
    <div>
      <PageHeader
        title="Checkpoints"
        description="Kelola titik pemeriksaan patroli keamanan"
        actions={
          <Button
            onClick={openCreate}
            className="bg-primary hover:bg-primary/80 text-white h-9"
          >
            <Plus className="size-4 mr-1.5" /> Tambah Checkpoint
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-[6px] p-6">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          totalItems={totalItems}
          searchPlaceholder="Cari checkpoint..."
          onSearchChange={(v) => {
            setSearch(v);
            setPage(0);
          }}
          searchValue={search}
          pagination={{
            pageIndex: page,
            pageSize: perPage,
            pageCount,
            onPageChange: setPage,
          }}
          emptyMessage="Belum ada checkpoint."
        />
      </div>

      {/* Create / Edit Modal */}
      <FormModal
        open={modalMode === "create" || modalMode === "edit"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title={modalMode === "create" ? "Tambah Checkpoint" : "Edit Checkpoint"}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={modalMode === "create" ? "Simpan" : "Perbarui"}
        size="lg"
      >
        <MapPicker
          lat={watchedLat}
          lon={watchedLon}
          onChange={(lat, lon) => {
            setValue("gps_lat", lat, { shouldDirty: true });
            setValue("gps_lon", lon, { shouldDirty: true });
          }}
        />
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>
                Nama Checkpoint <span className="text-[#FB2C36]">*</span>
              </Label>
              <Input
                {...field}
                placeholder="Contoh: Pintu Utama A"
                aria-invalid={!!errors.name}
                className={cn(errors.name && "border-[#FB2C36]")}
              />
              {errors.name && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          name="qr_code_value"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>
                QR Code Value <span className="text-[#FB2C36]">*</span>
              </Label>
              <Input
                {...field}
                placeholder="Contoh: QR-GATE-A-001"
                aria-invalid={!!errors.qr_code_value}
                className={cn(errors.qr_code_value && "border-[#FB2C36]")}
              />
              {errors.qr_code_value && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.qr_code_value.message}
                </p>
              )}
            </div>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="gps_lat"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label>
                  GPS Latitude <span className="text-[#FB2C36]">*</span>
                </Label>
                <Input
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={typeof field.value === "number" ? field.value : ""}
                  type="number"
                  step="any"
                  placeholder="-6.2088"
                  aria-invalid={!!errors.gps_lat}
                  className={cn(errors.gps_lat && "border-[#FB2C36]")}
                />
                {errors.gps_lat && (
                  <p className="text-[12px] text-[#FB2C36]">
                    {errors.gps_lat.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="gps_lon"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label>
                  GPS Longitude <span className="text-[#FB2C36]">*</span>
                </Label>
                <Input
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={typeof field.value === "number" ? field.value : ""}
                  type="number"
                  step="any"
                  placeholder="106.8456"
                  aria-invalid={!!errors.gps_lon}
                  className={cn(errors.gps_lon && "border-[#FB2C36]")}
                />
                {errors.gps_lon && (
                  <p className="text-[12px] text-[#FB2C36]">
                    {errors.gps_lon.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>Deskripsi</Label>
              <Textarea
                {...field}
                placeholder="Deskripsi lokasi checkpoint..."
                className="min-h-[80px]"
              />
            </div>
          )}
        />
      </FormModal>

      {/* Detail Modal */}
      <Dialog
        open={modalMode === "detail"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Detail Checkpoint</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4 py-2">
              {detailRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">
                    {row.label}
                  </span>
                  <span className="text-[14px] text-foreground">
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    closeModal();
                    openEdit(selected);
                  }}
                >
                  <Edit className="size-4 mr-1.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#FB2C36] text-[#FB2C36] hover:bg-[rgba(251,44,54,0.08)]"
                  onClick={() => {
                    closeModal();
                    setDeleteTarget(selected);
                  }}
                >
                  <Trash2 className="size-4 mr-1.5" /> Hapus
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Checkpoint?"
        description={`Apakah Anda yakin ingin menghapus checkpoint "${deleteTarget?.name}"?`}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

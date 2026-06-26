import { Controller } from "react-hook-form";
import { Edit, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useShiftsPage } from "./use-shifts-page";

export function ShiftPage() {
  const {
    columns,
    data,
    totalItems,
    pageCount,
    page,
    search,
    modalMode,
    selectedShift,
    deleteTarget,
    detailRows,
    isLoading,
    isSubmitting,
    isDeleting,
    form,
    openCreate,
    openEdit,
    closeModal,
    setPage,
    setSearch,
    setDeleteTarget,
    handleSubmit,
    confirmDelete,
  } = useShiftsPage();

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div>
      <PageHeader
        title="Shifts"
        description="Kelola jadwal shift petugas keamanan"
        actions={
          <Button
            onClick={openCreate}
            className="bg-primary hover:bg-primary/80 text-white h-9"
          >
            <Plus className="size-4 mr-1.5" /> Tambah Shift
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-[6px] p-6">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          totalItems={totalItems}
          // searchPlaceholder="Cari shift..."
          // onSearchChange={(value) => {
          //   setSearch(value);
          //   setPage(0);
          // }}
          // searchValue={search}
          pagination={{
            pageIndex: page,
            pageSize: 10,
            pageCount,
            onPageChange: setPage,
          }}
          emptyMessage="Belum ada shift. Klik 'Tambah Shift' untuk memulai."
        />
      </div>

      <FormModal
        open={modalMode === "create" || modalMode === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
        title={modalMode === "create" ? "Tambah Shift Baru" : "Edit Shift"}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={modalMode === "create" ? "Simpan Shift" : "Perbarui Shift"}
      >
        <Controller
          name="shift_name"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="shift_name">
                Nama Shift <span className="text-[#FB2C36]">*</span>
              </Label>
              <Input
                {...field}
                id="shift_name"
                placeholder="Contoh: Shift Pagi"
                aria-invalid={!!errors.shift_name}
                className={cn(errors.shift_name && "border-[#FB2C36]")}
              />
              {errors.shift_name && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.shift_name.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="shift_start_time"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="start_time">
                  Waktu Mulai <span className="text-[#FB2C36]">*</span>
                </Label>
                <Input
                  {...field}
                  id="start_time"
                  type="time"
                  aria-invalid={!!errors.shift_start_time}
                  className={cn(errors.shift_start_time && "border-[#FB2C36]")}
                />
                {errors.shift_start_time && (
                  <p className="text-[12px] text-[#FB2C36]">
                    {errors.shift_start_time.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="shift_end_time"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="end_time">
                  Waktu Selesai <span className="text-[#FB2C36]">*</span>
                </Label>
                <Input
                  {...field}
                  id="end_time"
                  type="time"
                  aria-invalid={!!errors.shift_end_time}
                  className={cn(errors.shift_end_time && "border-[#FB2C36]")}
                />
                {errors.shift_end_time && (
                  <p className="text-[12px] text-[#FB2C36]">
                    {errors.shift_end_time.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
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
            <DialogTitle>Detail Shift</DialogTitle>
          </DialogHeader>
          {selectedShift && (
            <div className="flex flex-col gap-4 py-2">
              {detailRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
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
                  onClick={() => openEdit(selectedShift)}
                >
                  <Edit className="size-4 mr-1.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#FB2C36] text-[#FB2C36] hover:bg-[rgba(251,44,54,0.08)]"
                  onClick={() => {
                    closeModal();
                    setDeleteTarget(selectedShift);
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
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="Hapus Shift?"
        description={`Apakah Anda yakin ingin menghapus shift "${deleteTarget?.shift_name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

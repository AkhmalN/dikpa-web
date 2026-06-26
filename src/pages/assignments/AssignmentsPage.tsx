import { Plus, Edit, Trash2, CalendarIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAssigmentPage } from "./use-assigment-page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function AssignmentsPage() {
  const {
    control,
    handleSubmit,
    errors,
    Controller,
    userData,
    shiftData,
    columns,
    checkpoints,
    watchedCheckpoints,
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
    filterComponent,
    isLoading,
    isSubmitting,
    isDeleting,
    openCreate,
    openEdit,
    closeModal,
    setPage,
    setSearch,
    setDeleteTarget,
    toggleCheckpoint,
    confirmDelete,
  } = useAssigmentPage();

  return (
    <div>
      <PageHeader
        title="Assignments"
        description="Kelola penugasan petugas ke shift dan checkpoint"
        actions={
          <Button
            onClick={openCreate}
            className="bg-primary hover:bg-primary/80 text-white h-9"
          >
            <Plus className="size-4 mr-1.5" /> Tambah Assignment
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-[6px] p-6">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          totalItems={totalItems}
          // searchPlaceholder="Cari petugas atau shift..."
          // onSearchChange={(v) => {
          //   setSearch(v);
          //   setPage(0);
          // }}
          // searchValue={search}
          filterComponent={filterComponent}
          pagination={{
            pageIndex: page,
            pageSize: perPage,
            pageCount,
            onPageChange: setPage,
          }}
          emptyMessage="Belum ada assignment."
        />
      </div>

      {/* Create / Edit Modal */}
      <FormModal
        open={modalMode === "create" || modalMode === "edit"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title={modalMode === "create" ? "Tambah Assignment" : "Edit Assignment"}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={modalMode === "create" ? "Simpan" : "Perbarui"}
        size="lg"
      >
        <div className="grid grid-cols-1 gap-4">
          <Controller
            name="user_id"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label>
                  Petugas <span className="text-[#FB2C36]">*</span>
                </Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    aria-invalid={!!errors.user_id}
                    className={cn(errors.user_id && "border-[#FB2C36]")}
                  >
                    <SelectValue placeholder="Pilih petugas" />
                  </SelectTrigger>
                  <SelectContent>
                    {userData.map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.user_id && (
                  <p className="text-[12px] text-[#FB2C36]">
                    {errors.user_id.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="shift_id"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label>
                  Shift <span className="text-[#FB2C36]">*</span>
                </Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    aria-invalid={!!errors.shift_id}
                    className={cn(errors.shift_id && "border-[#FB2C36]")}
                  >
                    <SelectValue placeholder="Pilih shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftData.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {`${s.shift_name} (${s.shift_start_time} - ${s.shift_end_time})`}
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
            name="duty_date"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label>
                  Tanggal Tugas <span className="text-[#FB2C36]">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 w-full justify-start text-left text-[13px] font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(parseISO(field.value), "dd MMM yyyy", {
                            locale: localeId,
                          })
                        : "Pilih Tanggal Tugas"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? parseISO(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      initialFocus
                    />
                    {field.value ? (
                      <div className="border-t p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 w-full text-[12px]"
                          onClick={() => field.onChange("")}
                        >
                          Reset Tanggal
                        </Button>
                      </div>
                    ) : null}
                  </PopoverContent>
                </Popover>
                {errors.duty_date && (
                  <p className="text-[12px] text-[#FB2C36]">
                    {errors.duty_date.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>
            Checkpoint <span className="text-[#FB2C36]">*</span>
          </Label>
          <div className="border border-border rounded-[4px] p-3 max-h-44 overflow-y-auto grid grid-cols-2 gap-2">
            {checkpoints?.map((cp) => (
              <label
                key={cp._id}
                className="flex items-center gap-2 cursor-pointer hover:bg-[#F5F5F5] p-1.5 rounded-[4px]"
              >
                <Checkbox
                  checked={watchedCheckpoints?.includes(cp._id) ?? false}
                  onCheckedChange={(checked) =>
                    toggleCheckpoint(cp._id, !!checked)
                  }
                />
                <span className="text-[13px] text-foreground">{cp.name}</span>
              </label>
            ))}
          </div>
          {errors.assigned_checkpoint_ids && (
            <p className="text-[12px] text-[#FB2C36]">
              {errors.assigned_checkpoint_ids.message}
            </p>
          )}
        </div>

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>Catatan</Label>
              <Textarea
                {...field}
                placeholder="Catatan tambahan..."
                className="min-h-[70px]"
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
            <DialogTitle>Detail Assignment</DialogTitle>
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
        title="Hapus Assignment?"
        description={`Apakah Anda yakin ingin menghapus assignment ini?`}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

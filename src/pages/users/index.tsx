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
import { useUsersPage } from "./use-users-page";

export function UsersPage() {
  const {
    columns,
    data,
    totalItems,
    pageCount,
    page,
    perPage,
    search,
    modalMode,
    selectedUser,
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
  } = useUsersPage();

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div>
      <PageHeader
        title="Users"
        description="Kelola pengguna sistem SmartPatrol"
        actions={
          <Button
            onClick={openCreate}
            className="bg-primary hover:bg-[#D6522F] text-white h-9"
          >
            <Plus className="size-4 mr-1.5" /> Tambah User
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-[6px] p-6">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          totalItems={totalItems}
          searchPlaceholder="Cari user, email, role..."
          onSearchChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
          searchValue={search}
          pagination={{
            pageIndex: page,
            pageSize: perPage,
            pageCount,
            onPageChange: setPage,
          }}
          emptyMessage="Belum ada user."
        />
      </div>

      <FormModal
        open={modalMode === "create" || modalMode === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
        title={modalMode === "create" ? "Tambah User" : "Edit User"}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={modalMode === "create" ? "Simpan" : "Perbarui"}
      >
        <Controller
          name="user_id"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>
                User ID <span className="text-[#FB2C36]">*</span>
              </Label>
              <Input
                {...field}
                placeholder="Contoh: user-001"
                disabled={modalMode === "edit"}
                aria-invalid={!!errors.user_id}
                className={cn(errors.user_id && "border-[#FB2C36]")}
              />
              {errors.user_id && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.user_id.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>
                Nama <span className="text-[#FB2C36]">*</span>
              </Label>
              <Input
                {...field}
                placeholder="Nama lengkap"
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
          name="email"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>
                Email <span className="text-[#FB2C36]">*</span>
              </Label>
              <Input
                {...field}
                type="email"
                placeholder="nama@company.com"
                aria-invalid={!!errors.email}
                className={cn(errors.email && "border-[#FB2C36]")}
              />
              {errors.email && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="app_role"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>
                Role <span className="text-[#FB2C36]">*</span>
              </Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  aria-invalid={!!errors.app_role}
                  className={cn(errors.app_role && "border-[#FB2C36]")}
                >
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="guard">Guard</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
              {errors.app_role && (
                <p className="text-[12px] text-[#FB2C36]">
                  {errors.app_role.message}
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
            <DialogTitle>Detail User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="flex flex-col gap-4 py-2">
              {detailRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">
                    {row.label}
                  </span>
                  <span className="text-[14px] text-foreground break-all">
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
                    openEdit(selectedUser);
                  }}
                >
                  <Edit className="size-4 mr-1.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#FB2C36] text-[#FB2C36] hover:bg-[rgba(251,44,54,0.08)]"
                  onClick={() => {
                    closeModal();
                    setDeleteTarget(selectedUser);
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
        title="Hapus User?"
        description={`Apakah Anda yakin ingin menghapus user \"${deleteTarget?.name}\"?`}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

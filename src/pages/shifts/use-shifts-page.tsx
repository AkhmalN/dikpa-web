import { useCallback, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { z } from "zod";
import {
  useCreateShiftMutation,
  useDeleteShiftMutation,
  useShiftsQuery,
  useUpdateShiftMutation,
} from "@/hooks/use-shift.query";
import type { Shift } from "@/types";
import { getShiftColumns } from "./columns";

export const shiftSchema = z.object({
  shift_name: z.string().min(1, "Nama shift wajib diisi").max(100),
  shift_start_time: z.string().min(1, "Waktu mulai wajib diisi"),
  shift_end_time: z.string().min(1, "Waktu selesai wajib diisi"),
});

export type ShiftFormData = z.infer<typeof shiftSchema>;

type ModalMode = "create" | "edit" | "detail" | null;

const PER_PAGE = 10;

const DEFAULT_SHIFT_FORM_VALUES: ShiftFormData = {
  shift_name: "",
  shift_start_time: "07:00",
  shift_end_time: "15:00",
};

function getShiftDetailRows(shift: Shift) {
  return [
    { label: "Nama Shift", value: shift.shift_name },
    { label: "Waktu Mulai", value: shift.shift_start_time },
    { label: "Waktu Selesai", value: shift.shift_end_time },
    {
      label: "Dibuat",
      value: format(parseISO(shift.createdAt), "dd MMM yyyy, HH:mm", {
        locale: localeId,
      }),
    },
    {
      label: "Diperbarui",
      value: format(parseISO(shift.updatedAt), "dd MMM yyyy, HH:mm", {
        locale: localeId,
      }),
    },
  ];
}

export function useShiftsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Shift | null>(null);

  const form = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: DEFAULT_SHIFT_FORM_VALUES,
  });

  const closeModal = useCallback(() => {
    setModalMode(null);
    setSelectedShift(null);
  }, []);

  const shiftsQuery = useShiftsQuery({ page, perPage: PER_PAGE, search: "" });
  const createMutation = useCreateShiftMutation({ onSuccess: closeModal });
  const updateMutation = useUpdateShiftMutation({ onSuccess: closeModal });
  const deleteMutation = useDeleteShiftMutation({
    onSuccess: () => setDeleteTarget(null),
  });

  const openCreate = useCallback(() => {
    form.reset(DEFAULT_SHIFT_FORM_VALUES);
    setSelectedShift(null);
    setModalMode("create");
  }, [form]);

  const openEdit = useCallback(
    (shift: Shift) => {
      form.reset({
        shift_name: shift.shift_name,
        shift_start_time: shift.shift_start_time,
        shift_end_time: shift.shift_end_time,
      });
      setSelectedShift(shift);
      setModalMode("edit");
    },
    [form],
  );

  const openDetail = useCallback((shift: Shift) => {
    setSelectedShift(shift);
    setModalMode("detail");
  }, []);

  const onSubmit = useCallback(
    (data: ShiftFormData) => {
      if (modalMode === "create") {
        console.log("Create payload:", data);
        createMutation.mutate(data);
        return;
      }

      if (modalMode === "edit" && selectedShift) {
        updateMutation.mutate({ id: selectedShift._id, payload: data });
      }
    },
    [createMutation, modalMode, selectedShift, updateMutation],
  );

  const columns = useMemo(
    () =>
      getShiftColumns({
        onDetail: openDetail,
        onEdit: openEdit,
        onDelete: setDeleteTarget,
      }),
    [openDetail, openEdit],
  );

  const detailRows = useMemo(
    () => (selectedShift ? getShiftDetailRows(selectedShift) : []),
    [selectedShift],
  );

  return {
    columns,
    data: shiftsQuery.data?.data ?? [],
    totalItems: shiftsQuery.data?.meta.total,
    pageCount: shiftsQuery.data?.meta.totalPages ?? 1,
    page,
    search,
    modalMode,
    selectedShift,
    deleteTarget,
    detailRows,
    isLoading: shiftsQuery.isLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    form,
    openCreate,
    openEdit,
    closeModal,
    setPage,
    setSearch,
    setDeleteTarget,
    handleSubmit: form.handleSubmit(onSubmit),
    confirmDelete: () =>
      deleteTarget && deleteMutation.mutate(deleteTarget._id),
  };
}

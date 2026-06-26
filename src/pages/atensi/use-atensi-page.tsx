import { useCallback, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { z } from "zod";
import {
  useAtensiQuery,
  useCreateAtensiMutation,
  useDeleteAtensiMutation,
  useUpdateAtensiMutation,
  useShiftsSelectQuery,
  useCheckpointsSelectQuery,
} from "@/hooks/use-atensi-query";
import type { Atensi } from "@/types/atensi.types";
import { getAtensiColumns } from "./columns";

export const atensiSchema = z.object({
  shift_id: z.string().min(1, "Shift wajib dipilih"),
  checkpoint_id: z.string().nullable().optional(),
  title: z.string().min(1, "Judul wajib diisi").max(150),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  photo_url: z.string().nullable().optional(),
  expires_at: z.string().min(1, "Waktu kadaluarsa wajib diisi"),
});

export type AtensiFormData = z.infer<typeof atensiSchema>;

type ModalMode = "create" | "edit" | "detail" | null;

const PER_PAGE = 10;

const DEFAULT_ATENSI_FORM_VALUES: AtensiFormData = {
  shift_id: "",
  checkpoint_id: null,
  title: "",
  description: "",
  photo_url: null,
  expires_at: "",
};

function getAtensiDetailRows(
  atensi: Atensi,
  shiftName: string,
  checkpointName: string,
) {
  return [
    { label: "Judul", value: atensi.title },
    { label: "Deskripsi", value: atensi.description },
    { label: "Shift", value: shiftName || atensi.shift_id },
    {
      label: "Checkpoint",
      value: atensi.checkpoint_id
        ? checkpointName || atensi.checkpoint_id
        : "Semua Checkpoint",
    },
    {
      label: "URL Foto",
      value: atensi.photo_url ?? "-",
    },
    {
      label: "Kadaluarsa",
      value: format(parseISO(atensi.expires_at), "dd MMM yyyy, HH:mm", {
        locale: localeId,
      }),
    },
    {
      label: "Dibuat Oleh",
      value: atensi.created_by,
    },
    {
      label: "Dibuat",
      value: format(parseISO(atensi.created_at), "dd MMM yyyy, HH:mm", {
        locale: localeId,
      }),
    },
    {
      label: "Diperbarui",
      value: format(parseISO(atensi.updated_at), "dd MMM yyyy, HH:mm", {
        locale: localeId,
      }),
    },
  ];
}

export function useAtensiPage() {
  const [page, setPage] = useState(0);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedAtensi, setSelectedAtensi] = useState<Atensi | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Atensi | null>(null);

  const form = useForm<AtensiFormData>({
    resolver: zodResolver(atensiSchema),
    defaultValues: DEFAULT_ATENSI_FORM_VALUES,
  });

  const closeModal = useCallback(() => {
    setModalMode(null);
    setSelectedAtensi(null);
  }, []);

  const atensiQuery = useAtensiQuery({ page, perPage: PER_PAGE });
  const shiftsQuery = useShiftsSelectQuery();
  const checkpointsQuery = useCheckpointsSelectQuery();
  const createMutation = useCreateAtensiMutation({ onSuccess: closeModal });
  const updateMutation = useUpdateAtensiMutation({ onSuccess: closeModal });
  const deleteMutation = useDeleteAtensiMutation({
    onSuccess: () => setDeleteTarget(null),
  });

  // Build lookup maps: id => name
  const shiftNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (shiftsQuery.data) {
      for (const s of shiftsQuery.data) {
        map[s._id] = s.shift_name;
      }
    }
    return map;
  }, [shiftsQuery.data]);

  const checkpointNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (checkpointsQuery.data) {
      for (const c of checkpointsQuery.data) {
        map[c._id] = c.name;
      }
    }
    return map;
  }, [checkpointsQuery.data]);

  const openCreate = useCallback(() => {
    form.reset(DEFAULT_ATENSI_FORM_VALUES);
    setSelectedAtensi(null);
    setModalMode("create");
  }, [form]);

  const openEdit = useCallback(
    (atensi: Atensi) => {
      form.reset({
        shift_id: atensi.shift_id,
        checkpoint_id: atensi.checkpoint_id,
        title: atensi.title,
        description: atensi.description,
        photo_url: atensi.photo_url,
        expires_at: atensi.expires_at
          ? format(parseISO(atensi.expires_at), "yyyy-MM-dd'T'HH:mm")
          : "",
      });
      setSelectedAtensi(atensi);
      setModalMode("edit");
    },
    [form],
  );

  const openDetail = useCallback((atensi: Atensi) => {
    setSelectedAtensi(atensi);
    setModalMode("detail");
  }, []);

  const onSubmit = useCallback(
    (data: AtensiFormData) => {
      const payload = {
        shift_id: data.shift_id,
        checkpoint_id: data.checkpoint_id ?? null,
        title: data.title,
        description: data.description,
        photo_url: data.photo_url ?? null,
        expires_at: new Date(data.expires_at).toISOString(),
      };

      if (modalMode === "create") {
        createMutation.mutate(payload);
        return;
      }

      if (modalMode === "edit" && selectedAtensi) {
        updateMutation.mutate({ id: selectedAtensi._id, payload });
      }
    },
    [createMutation, modalMode, selectedAtensi, updateMutation],
  );

  const columns = useMemo(
    () =>
      getAtensiColumns({
        onDetail: openDetail,
        onEdit: openEdit,
        onDelete: setDeleteTarget,
        shiftNameMap,
        checkpointNameMap,
      }),
    [openDetail, openEdit, shiftNameMap, checkpointNameMap],
  );

  const detailRows = useMemo(
    () =>
      selectedAtensi
        ? getAtensiDetailRows(
            selectedAtensi,
            shiftNameMap[selectedAtensi.shift_id] ?? "",
            selectedAtensi.checkpoint_id
              ? (checkpointNameMap[selectedAtensi.checkpoint_id] ?? "")
              : "",
          )
        : [],
    [selectedAtensi, shiftNameMap, checkpointNameMap],
  );

  return {
    columns,
    data: atensiQuery.data?.data ?? [],
    totalItems: atensiQuery.data?.meta.total,
    pageCount: atensiQuery.data?.meta.totalPages ?? 1,
    page,
    modalMode,
    selectedAtensi,
    deleteTarget,
    detailRows,
    isLoading: atensiQuery.isLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    form,
    shifts: shiftsQuery.data ?? [],
    checkpoints: checkpointsQuery.data ?? [],
    shiftsLoading: shiftsQuery.isLoading,
    checkpointsLoading: checkpointsQuery.isLoading,
    openCreate,
    openEdit,
    closeModal,
    setPage,
    setDeleteTarget,
    handleSubmit: form.handleSubmit(onSubmit),
    confirmDelete: () =>
      deleteTarget && deleteMutation.mutate(deleteTarget._id),
  };
}

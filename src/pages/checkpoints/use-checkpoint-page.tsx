import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { z } from "zod";
import type { Checkpoint } from "@/types";
import {
  useCheckpointsQuery,
  useCreateCheckpointMutation,
  useDeleteCheckpointMutation,
  usePrintCheckpointQrMutation,
  useUpdateCheckpointMutation,
} from "@/hooks/use-checkpoint-query";
import { getCheckpointColumns } from "./columns";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  qr_code_value: z.string().min(1, "QR Code wajib diisi"),
  gps_lat: z.preprocess(
    (v) => parseFloat(String(v)),
    z.number().min(-90).max(90, "Latitude tidak valid"),
  ),
  gps_lon: z.preprocess(
    (v) => parseFloat(String(v)),
    z.number().min(-180).max(180, "Longitude tidak valid"),
  ),
  description: z.string().optional(),
});

type FormData = {
  name: string;
  qr_code_value: string;
  gps_lat: number;
  gps_lon: number;
  description?: string;
};
type FormInput = z.input<typeof schema>;

type ModalMode = "create" | "edit" | "detail" | null;

const PER_PAGE = 10;

const DEFAULT_CHECKPOINT_FORM_VALUES: FormData = {
  name: "",
  qr_code_value: "",
  gps_lat: -6.2088,
  gps_lon: 106.8456,
  description: "",
};

function getCheckpointDetailRows(checkpoint: Checkpoint) {
  return [
    { label: "Nama", value: checkpoint.name },
    { label: "QR Code", value: checkpoint.qr_code_value },
    { label: "GPS Latitude", value: String(checkpoint.gps_lat) },
    { label: "GPS Longitude", value: String(checkpoint.gps_lon) },
    { label: "Deskripsi", value: checkpoint.description || "-" },
    {
      label: "Dibuat",
      value: format(parseISO(checkpoint.createdAt), "dd MMM yyyy, HH:mm", {
        locale: localeId,
      }),
    },
  ];
}

export function useCheckpointPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Checkpoint | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Checkpoint | null>(null);

  const dataQuery = useCheckpointsQuery({ page, perPage: PER_PAGE, search });

  const openDetail = useCallback((cp: Checkpoint) => {
    setSelected(cp);
    setModalMode("detail");
  }, []);

  const form = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_CHECKPOINT_FORM_VALUES,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const closeModal = useCallback(() => {
    setModalMode(null);
    setSelected(null);
  }, []);

  const createMutation = useCreateCheckpointMutation({ onSuccess: closeModal });
  const updateMutation = useUpdateCheckpointMutation({ onSuccess: closeModal });
  const deleteMutation = useDeleteCheckpointMutation({
    onSuccess: () => setDeleteTarget(null),
  });

  const openEdit = useCallback(
    (cp: Checkpoint) => {
      reset({
        name: cp.name,
        qr_code_value: cp.qr_code_value,
        gps_lat: cp.gps_lat,
        gps_lon: cp.gps_lon,
        description: cp.description ?? "",
      });
      setSelected(cp);
      setModalMode("edit");
    },
    [reset],
  );

  const openCreate = useCallback(() => {
    reset(DEFAULT_CHECKPOINT_FORM_VALUES);
    setSelected(null);
    setModalMode("create");
  }, [reset]);

  const printQrMutation = usePrintCheckpointQrMutation();

  const openPrintQr = useCallback(
    (cp: Checkpoint) => {
      printQrMutation.mutate(cp._id);
    },
    [printQrMutation],
  );

  const columns = useMemo(
    () =>
      getCheckpointColumns({
        openDetail,
        openEdit,
        setDeleteTarget,
        openPrintQr,
      }),
    [openDetail, openEdit, openPrintQr],
  );

  const detailRows = useMemo(
    () => (selected ? getCheckpointDetailRows(selected) : []),
    [selected],
  );

  const onSubmit = useCallback(
    (data: FormData) => {
      if (modalMode === "create") {
        createMutation.mutate(data);
        return;
      }

      if (modalMode === "edit" && selected) {
        updateMutation.mutate({ id: selected._id, payload: data });
      }
    },
    [modalMode, selected, createMutation, updateMutation],
  );

  return {
    columns,
    data: dataQuery.data?.data ?? [],
    totalItems: dataQuery.data?.total,
    pageCount: dataQuery.data?.total_pages ?? 1,
    page,
    perPage: PER_PAGE,
    search,
    modalMode,
    selected,
    deleteTarget,
    detailRows,
    isLoading: dataQuery.isLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    control,
    errors,
    openCreate,
    openEdit,
    openDetail,
    closeModal,
    setPage,
    setSearch,
    setDeleteTarget,
    handleSubmit: handleSubmit(onSubmit),
    confirmDelete: () =>
      deleteTarget && deleteMutation.mutate(deleteTarget._id),
  };
}

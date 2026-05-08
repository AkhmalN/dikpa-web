import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { z } from "zod";
import { StatusBadge } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Assignment, AssignmentStatus } from "@/types";
import {
  useAssignmentCheckpointsQuery,
  useAssignmentsQuery,
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
  useUpdateAssignmentMutation,
} from "@/hooks/use-assigment-query";

const STATUS_LABELS: Record<
  AssignmentStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Aktif",
    className:
      "bg-[rgba(0,201,81,0.15)] text-[#00C951] border-[rgba(0,201,81,0.3)]",
  },
  inactive: {
    label: "Nonaktif",
    className:
      "bg-[rgba(82,82,82,0.1)] text-[#525252] border-[rgba(82,82,82,0.2)]",
  },
  completed: {
    label: "Selesai",
    className:
      "bg-[rgba(0,184,219,0.15)] text-[#00B8DB] border-[rgba(0,184,219,0.3)]",
  },
};

const schema = z.object({
  user_id: z.string().min(1, "User wajib dipilih"),
  shift_id: z.string().min(1, "Shift wajib dipilih"),
  assigned_checkpoint_ids: z
    .array(z.string())
    .min(1, "Pilih minimal 1 checkpoint"),
  status: z.enum(["active", "inactive", "completed"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type ModalMode = "create" | "edit" | "detail" | null;

const PER_PAGE = 10;

const DEFAULT_ASSIGNMENT_FORM_VALUES: FormData = {
  user_id: "",
  shift_id: "",
  assigned_checkpoint_ids: [],
  status: "active",
  notes: "",
};

const MOCK_USERS = [
  { id: "u1", name: "Joko Widodo" },
  { id: "u2", name: "Siti Rahayu" },
  { id: "u3", name: "Bambang Sutrisno" },
  { id: "u4", name: "Dewi Lestari" },
  { id: "u5", name: "Hendra Gunawan" },
];

const MOCK_SHIFTS = [
  { id: "s1", shift_name: "Shift Pagi (06:00-14:00)" },
  { id: "s2", shift_name: "Shift Siang (14:00-22:00)" },
  { id: "s3", shift_name: "Shift Malam (22:00-06:00)" },
];

function getAssignmentDetailRows(assignment: Assignment) {
  return [
    {
      label: "Petugas",
      value: assignment.user_name || assignment.user_id,
    },
    {
      label: "Shift",
      value: assignment.shift_name || assignment.shift_id,
    },
    {
      label: "Checkpoint",
      value: `${assignment.assigned_checkpoint_ids.length} titik dipilih`,
    },
    {
      label: "Status",
      value: STATUS_LABELS[assignment.status]?.label,
    },
    { label: "Catatan", value: assignment.notes || "—" },
    {
      label: "Dibuat",
      value: format(parseISO(assignment.created_at), "dd MMM yyyy, HH:mm", {
        locale: localeId,
      }),
    },
  ];
}

export function useAssigmentPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);

  const assignmentsQuery = useAssignmentsQuery({
    page,
    perPage: PER_PAGE,
    search,
    statusFilter,
  });
  const checkpointsQuery = useAssignmentCheckpointsQuery();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_ASSIGNMENT_FORM_VALUES,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchedCheckpoints = watch("assigned_checkpoint_ids");

  const closeModal = useCallback(() => {
    setModalMode(null);
    setSelected(null);
  }, []);

  const createMutation = useCreateAssignmentMutation({ onSuccess: closeModal });
  const updateMutation = useUpdateAssignmentMutation({ onSuccess: closeModal });
  const deleteMutation = useDeleteAssignmentMutation({
    onSuccess: () => setDeleteTarget(null),
  });

  const openCreate = useCallback(() => {
    reset(DEFAULT_ASSIGNMENT_FORM_VALUES);
    setSelected(null);
    setModalMode("create");
  }, [reset]);

  const openEdit = useCallback(
    (assignment: Assignment) => {
      reset({
        user_id: assignment.user_id,
        shift_id: assignment.shift_id,
        assigned_checkpoint_ids: assignment.assigned_checkpoint_ids,
        status: assignment.status,
        notes: assignment.notes ?? "",
      });
      setSelected(assignment);
      setModalMode("edit");
    },
    [reset],
  );

  const openDetail = useCallback((assignment: Assignment) => {
    setSelected(assignment);
    setModalMode("detail");
  }, []);

  const onSubmit = useCallback(
    (data: FormData) => {
      if (modalMode === "create") {
        createMutation.mutate(data);
        return;
      }

      if (modalMode === "edit" && selected) {
        updateMutation.mutate({ id: selected.id, payload: data });
      }
    },
    [modalMode, selected, createMutation, updateMutation],
  );

  const toggleCheckpoint = useCallback(
    (checkpointId: string, checked: boolean) => {
      const current = watchedCheckpoints ?? [];
      if (checked) {
        setValue("assigned_checkpoint_ids", [...current, checkpointId]);
        return;
      }

      setValue(
        "assigned_checkpoint_ids",
        current.filter((id) => id !== checkpointId),
      );
    },
    [setValue, watchedCheckpoints],
  );

  const columns = useMemo<ColumnDef<Assignment>[]>(
    () => [
      {
        accessorKey: "user_name",
        header: "Petugas",
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.user_name || "—"}
          </span>
        ),
      },
      {
        accessorKey: "shift_name",
        header: "Shift",
        cell: ({ row }) => (
          <span className="text-[13px] text-muted-foreground">
            {row.original.shift_name || "—"}
          </span>
        ),
      },
      {
        id: "checkpoints_count",
        header: "Checkpoint",
        cell: ({ row }) => (
          <span className="text-[13px] font-medium">
            {row.original.assigned_checkpoint_ids.length} titik
          </span>
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
        accessorKey: "notes",
        header: "Catatan",
        cell: ({ row }) => (
          <span className="text-[13px] text-muted-foreground truncate max-w-[160px] block">
            {row.original.notes || "—"}
          </span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Dibuat",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-[13px]">
            {format(parseISO(row.original.created_at), "dd MMM yyyy", {
              locale: localeId,
            })}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetail(row.original)}>
                <Eye className="size-4 mr-2" /> Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEdit(row.original)}>
                <Edit className="size-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteTarget(row.original)}
                className="text-[#FB2C36] focus:text-[#FB2C36] focus:bg-[rgba(251,44,54,0.08)]"
              >
                <Trash2 className="size-4 mr-2" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [openDetail, openEdit],
  );

  const filterComponent = useMemo(
    () => (
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
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="inactive">Nonaktif</SelectItem>
          <SelectItem value="completed">Selesai</SelectItem>
        </SelectContent>
      </Select>
    ),
    [statusFilter],
  );

  const detailRows = useMemo(
    () => (selected ? getAssignmentDetailRows(selected) : []),
    [selected],
  );

  return {
    Controller,
    MOCK_USERS,
    MOCK_SHIFTS,
    columns,
    control,
    errors,
    checkpoints: checkpointsQuery.data ?? [],
    watchedCheckpoints,
    data: assignmentsQuery.data?.data ?? [],
    totalItems: assignmentsQuery.data?.total,
    pageCount: assignmentsQuery.data?.total_pages ?? 1,
    page,
    perPage: PER_PAGE,
    search,
    statusFilter,
    modalMode,
    selected,
    deleteTarget,
    detailRows,
    filterComponent,
    isLoading: assignmentsQuery.isLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    openCreate,
    openEdit,
    closeModal,
    setPage,
    setSearch,
    setDeleteTarget,
    toggleCheckpoint,
    handleSubmit: handleSubmit(onSubmit),
    confirmDelete: () => deleteTarget && deleteMutation.mutate(deleteTarget.id),
  };
}

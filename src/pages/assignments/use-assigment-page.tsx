import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Assignment, AssignmentStatus, Period } from "@/types";
import {
  useAssignmentCheckpointsQuery,
  useAssignmentsQuery,
  useCreateAssignmentMutation,
  useDeleteAssignmentMutation,
  useUpdateAssignmentMutation,
} from "@/hooks/use-assigment-query";
import { useAssignmentColumns } from "./columns";
import { useShiftsQuery } from "@/hooks/use-shift.query";
import { useUsersQuery } from "@/hooks/use-user-query";
import { Calendar } from "@/components/ui/calendar";

export const ASSIGMENT_STATUS_LABEL: Record<
  AssignmentStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Aktif",
    className:
      "bg-[rgba(0,201,81,0.15)] text-[#00C951] border-[rgba(0,201,81,0.3)]",
  },
  PENDING: {
    label: "Menunggu",
    className:
      "bg-[rgba(255,193,7,0.15)] text-[#FFC107] border-[rgba(255,193,7,0.3)]",
  },
  CANCELLED: {
    label: "Dibatalkan",
    className:
      "bg-[rgba(220,53,69,0.15)] text-[#DC3545] border-[rgba(220,53,69,0.3)]",
  },
  COMPLETED: {
    label: "Selesai",
    className:
      "bg-[rgba(0,184,219,0.15)] text-[#00B8DB] border-[rgba(0,184,219,0.3)]",
  },
};

const schema = z.object({
  user_id: z.string().min(1, "User wajib dipilih"),
  shift_id: z.string().min(1, "Shift wajib dipilih"),
  duty_date: z.string().min(1, "Tanggal tugas wajib dipilih"),
  assigned_checkpoint_ids: z
    .array(z.string())
    .min(1, "Pilih minimal 1 checkpoint"),
  status: z.enum(["PENDING", "ACTIVE", "CANCELLED", "COMPLETED"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type ModalMode = "create" | "edit" | "detail" | null;

const PER_PAGE = 10;

const DEFAULT_ASSIGNMENT_FORM_VALUES: FormData = {
  user_id: "",
  shift_id: "",
  duty_date: "",
  assigned_checkpoint_ids: [],
  status: "PENDING",
  notes: "",
};

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
      value: ASSIGMENT_STATUS_LABEL[assignment.status]?.label,
    },
    { label: "Catatan", value: assignment.notes || "—" },
    {
      label: "Dibuat",
      value: format(parseISO(assignment.createdAt), "dd MMM yyyy, HH:mm", {
        locale: localeId,
      }),
    },
  ];
}

export function useAssigmentPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "all">(
    "all",
  );
  const [periodFilter, setPeriodFilter] = useState<Period>("daily");
  const [dutyDate, setDutyDate] = useState<Date | undefined>(undefined);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);

  const assignmentsQuery = useAssignmentsQuery({
    page,
    perPage: PER_PAGE,
    search,
    statusFilter,
    period: periodFilter,
    dutyDate: dutyDate ? format(dutyDate, "yyyy-MM-dd") : undefined,
  });

  const checkpointsQuery = useAssignmentCheckpointsQuery();

  const shiftsQuery = useShiftsQuery({
    page: 0,
    perPage: 100,
    search: "",
  });

  const usersQuery = useUsersQuery({
    page: 0,
    perPage: 100,
    search: "",
  });

  const columns = useAssignmentColumns({
    openDetail: (assignment) => {
      setSelected(assignment);
      setModalMode("detail");
    },
    openEdit: (assignment) => {
      setSelected(assignment);
      setModalMode("edit");
    },
    setDeleteTarget,
  });

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
        duty_date: assignment.duty_date ?? "",
        assigned_checkpoint_ids: assignment.assigned_checkpoint_ids,
        status: assignment.status,
        notes: assignment.notes ?? "",
      });
      setSelected(assignment);
      setModalMode("edit");
    },
    [reset],
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

  const filterComponent = useMemo(
    () => (
      <div className="flex flex-row gap-5 items-center">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as AssignmentStatus | "all");
            setPage(0);
          }}
        >
          <SelectTrigger className="w-36 h-9 text-[13px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="PENDING">Menunggu</SelectItem>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
            <SelectItem value="COMPLETED">Selesai</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={periodFilter}
          onValueChange={(value) => {
            setPeriodFilter(value as Period);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-36 h-9 text-[13px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Harian</SelectItem>
            <SelectItem value="weekly">Mingguan</SelectItem>
            <SelectItem value="monthly">Bulanan</SelectItem>
            <SelectItem value="yearly">Tahunan</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-1 h-5 bg-slate-200 inline-block" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-56 h-9 justify-start text-left text-[13px] font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dutyDate
                ? format(dutyDate, "dd MMM yyyy", { locale: localeId })
                : "Pilih Tanggal Tugas"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dutyDate}
              onSelect={(date) => {
                setDutyDate(date);
                setPage(0);
              }}
              initialFocus
            />
            {dutyDate ? (
              <div className="border-t p-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-full text-[12px]"
                  onClick={() => {
                    setDutyDate(undefined);
                    setPage(0);
                  }}
                >
                  Reset Tanggal
                </Button>
              </div>
            ) : null}
          </PopoverContent>
        </Popover>
      </div>
    ),
    [statusFilter, periodFilter, dutyDate],
  );

  const detailRows = useMemo(
    () => (selected ? getAssignmentDetailRows(selected) : []),
    [selected],
  );

  return {
    Controller,
    userData: usersQuery.data?.data ?? [],
    columns,
    control,
    errors,
    checkpoints: checkpointsQuery.data ?? [],
    watchedCheckpoints,
    data: assignmentsQuery.data?.data ?? [],
    shiftData: shiftsQuery.data?.data ?? [],
    totalItems: assignmentsQuery.data?.meta.total ?? 0,
    pageCount: assignmentsQuery.data?.meta.totalPages ?? 1,
    page,
    perPage: PER_PAGE,
    search,
    statusFilter,
    dutyDate,
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
    confirmDelete: () =>
      deleteTarget && deleteMutation.mutate(deleteTarget._id),
  };
}

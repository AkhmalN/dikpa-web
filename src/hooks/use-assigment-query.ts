import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignmentsService } from "@/services/assignments.service";
import { checkpointsService } from "@/services/checkpoints.service";
import type { AssignmentPayload, AssignmentStatus, Period } from "@/types";

type AssignmentListFilters = {
  page: number;
  perPage: number;
  search: string;
  statusFilter: string;
  period: Period;
  dutyDate?: string;
};

type MutationHookOptions = {
  onSuccess?: () => void;
};

export const assignmentQueryKeys = {
  all: ["assignments"] as const,
  list: ({
    page,
    perPage,
    search,
    statusFilter,
    period,
    dutyDate,
  }: AssignmentListFilters) =>
    [
      "assignments",
      page,
      perPage,
      search.trim(),
      statusFilter,
      period,
      dutyDate ?? "",
    ] as const,
  checkpoints: ["checkpoints-all"] as const,
};

export function useAssignmentsQuery(filters: AssignmentListFilters) {
  return useQuery({
    queryKey: assignmentQueryKeys.list(filters),
    queryFn: () =>
      assignmentsService.getList({
        page: filters.page + 1,
        limit: filters.perPage,
        status: filters.statusFilter as AssignmentStatus,
        period: filters.period as Period,
        duty_date: filters.dutyDate,
      }),
    placeholderData: (previousData) => previousData,
  });
}

export function useAssignmentCheckpointsQuery() {
  return useQuery({
    queryKey: assignmentQueryKeys.checkpoints,
    queryFn: () => checkpointsService.getAll(),
  });
}

export function useCreateAssignmentMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignmentPayload) =>
      assignmentsService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: assignmentQueryKeys.all,
      });
      toast.success("Assignment berhasil dibuat!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat assignment");
    },
  });
}

export function useUpdateAssignmentMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignmentPayload }) =>
      assignmentsService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: assignmentQueryKeys.all,
      });
      toast.success("Assignment berhasil diperbarui!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui assignment");
    },
  });
}

export function useDeleteAssignmentMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentsService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: assignmentQueryKeys.all,
      });
      toast.success("Assignment berhasil dihapus!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus assignment");
    },
  });
}

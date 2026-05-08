import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { shiftsService } from "@/services/shifts.service";
import type { ShiftPayload } from "@/types";

type ShiftListFilters = {
  page: number;
  perPage: number;
  search: string;
};

type MutationHookOptions = {
  onSuccess?: () => void;
};

export const shiftQueryKeys = {
  all: ["shifts"] as const,
  list: ({ page, perPage, search }: ShiftListFilters) =>
    ["shifts", page, perPage, search.trim()] as const,
};

export function useShiftsQuery(filters: ShiftListFilters) {
  return useQuery({
    queryKey: shiftQueryKeys.list(filters),
    queryFn: () =>
      shiftsService.getList({
        page: filters.page + 1,
        per_page: filters.perPage,
        search: filters.search.trim(),
      }),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateShiftMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ShiftPayload) => shiftsService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shiftQueryKeys.all });
      toast.success("Shift berhasil dibuat!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat shift");
    },
  });
}

export function useUpdateShiftMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ShiftPayload }) =>
      shiftsService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shiftQueryKeys.all });
      toast.success("Shift berhasil diperbarui!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui shift");
    },
  });
}

export function useDeleteShiftMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shiftsService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shiftQueryKeys.all });
      toast.success("Shift berhasil dihapus!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus shift");
    },
  });
}

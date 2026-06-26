import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { atensiServices } from "@/services/atensi.services";
import { shiftsService } from "@/services/shifts.service";
import { checkpointsService } from "@/services/checkpoints.service";
import type { CreateAtensiDto, UpdateAtensiDto } from "@/types/atensi.types";

type AtensiListFilters = {
  page: number;
  perPage: number;
  shift_id?: string;
  checkpoint_id?: string;
};

type MutationHookOptions = {
  onSuccess?: () => void;
};

export const atensiQueryKeys = {
  all: ["atensi"] as const,
  list: ({ page, perPage, shift_id, checkpoint_id }: AtensiListFilters) =>
    ["atensi", page, perPage, shift_id ?? "", checkpoint_id ?? ""] as const,
};

export function useAtensiQuery(filters: AtensiListFilters) {
  return useQuery({
    queryKey: atensiQueryKeys.list(filters),
    queryFn: () =>
      atensiServices.getList({
        page: filters.page + 1,
        per_page: filters.perPage,
        shift_id: filters.shift_id,
        checkpoint_id: filters.checkpoint_id,
      }),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateAtensiMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAtensiDto) => atensiServices.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: atensiQueryKeys.all });
      toast.success("Atensi berhasil dibuat!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat atensi");
    },
  });
}

export function useUpdateAtensiMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAtensiDto }) =>
      atensiServices.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: atensiQueryKeys.all });
      toast.success("Atensi berhasil diperbarui!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui atensi");
    },
  });
}

export function useDeleteAtensiMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => atensiServices.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: atensiQueryKeys.all });
      toast.success("Atensi berhasil dihapus!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus atensi");
    },
  });
}

// --- Lookup queries for Select dropdowns ---

export function useShiftsSelectQuery() {
  return useQuery({
    queryKey: ["shifts", "select"],
    queryFn: () => shiftsService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCheckpointsSelectQuery() {
  return useQuery({
    queryKey: ["checkpoints", "select"],
    queryFn: () => checkpointsService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

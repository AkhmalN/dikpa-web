import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkpointsService } from "@/services/checkpoints.service";
import type { CheckpointPayload } from "@/types";

type CheckpointListFilters = {
  page: number;
  perPage: number;
  search: string;
};

type MutationHookOptions = {
  onSuccess?: () => void;
};

export const checkpointQueryKeys = {
  all: ["checkpoints"] as const,
  list: ({ page, perPage, search }: CheckpointListFilters) =>
    ["checkpoints", page, perPage, search.trim()] as const,
};

export function useCheckpointsQuery(filters: CheckpointListFilters) {
  return useQuery({
    queryKey: checkpointQueryKeys.list(filters),
    queryFn: () =>
      checkpointsService.getList({
        page: filters.page + 1,
        per_page: filters.perPage,
        search: filters.search.trim(),
      }),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateCheckpointMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckpointPayload) =>
      checkpointsService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: checkpointQueryKeys.all,
      });
      toast.success("Checkpoint berhasil dibuat!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat checkpoint");
    },
  });
}

export function useUpdateCheckpointMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CheckpointPayload }) =>
      checkpointsService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: checkpointQueryKeys.all,
      });
      toast.success("Checkpoint berhasil diperbarui!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui checkpoint");
    },
  });
}

export function useDeleteCheckpointMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => checkpointsService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: checkpointQueryKeys.all,
      });
      toast.success("Checkpoint berhasil dihapus!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus checkpoint");
    },
  });
}

export function usePrintCheckpointQrMutation() {
  return useMutation({
    mutationFn: (id: string) => checkpointsService.printQr(id),
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengunduh QR checkpoint");
    },
  });
}

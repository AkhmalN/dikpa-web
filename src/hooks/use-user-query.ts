import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersService } from "@/services/users.service";
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/services/users.service";

type UserListQuery = {
  page: number;
  perPage: number;
  search: string;
};

type MutationHookOptions = {
  onSuccess?: () => void;
};

export const userQueryKeys = {
  all: ["users"] as const,
  list: ({ page, perPage, search }: UserListQuery) =>
    ["users", page, perPage, search.trim()] as const,
};

export function useUsersQuery(filters: UserListQuery) {
  return useQuery({
    queryKey: userQueryKeys.list(filters),
    queryFn: () =>
      usersService.getList({
        page: filters.page + 1,
        per_page: filters.perPage,
        search: filters.search.trim(),
      }),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateUserMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserRequest) => usersService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      toast.success("User berhasil dibuat!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat user");
    },
  });
}

export function useUpdateUserMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRequest }) =>
      usersService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      toast.success("User berhasil diperbarui!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui user");
    },
  });
}

export function useDeleteUserMutation(options?: MutationHookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      toast.success("User berhasil dihapus!");
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus user");
    },
  });
}

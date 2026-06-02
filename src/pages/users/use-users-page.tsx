import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AppRole, UserPayload } from "@/services/users.service";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUsersQuery,
} from "@/hooks/use-user-query";
import { getUserColumns } from "./columns";

const userSchema = z.object({
  user_id: z.string().min(1, "User ID wajib diisi").max(100),
  name: z.string().min(1, "Nama wajib diisi").max(100),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  app_role: z.enum(["tenant_admin", "supervisor", "guard", "auditor"]),
});

export type UserFormData = z.infer<typeof userSchema>;

type ModalMode = "create" | "edit" | "detail" | null;

const PER_PAGE = 10;

const DEFAULT_USER_FORM_VALUES: UserFormData = {
  user_id: "",
  name: "",
  email: "",
  app_role: "guard",
};

const ROLE_LABEL: Record<AppRole, string> = {
  tenant_admin: "Tenant Admin",
  supervisor: "Supervisor",
  guard: "Guard",
  auditor: "Auditor",
};

function getUserDetailRows(user: UserPayload) {
  return [
    { label: "Nama", value: user.name },
    { label: "Email", value: user.email },
    { label: "User ID", value: user.user_id },
    { label: "Tenant ID", value: user.tenant_id },
    { label: "Role", value: ROLE_LABEL[user.app_role] },
    { label: "Mongo ID", value: user._id },
  ];
}

export function useUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<UserPayload | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserPayload | null>(null);

  // User contract mengembalikan list tanpa meta, jadi paging dan search ditangani di frontend.
  const usersQuery = useUsersQuery({ page: 0, perPage: 1000, search: "" });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: DEFAULT_USER_FORM_VALUES,
  });

  const closeModal = useCallback(() => {
    setModalMode(null);
    setSelectedUser(null);
  }, []);

  const createMutation = useCreateUserMutation({ onSuccess: closeModal });
  const updateMutation = useUpdateUserMutation({ onSuccess: closeModal });
  const deleteMutation = useDeleteUserMutation({
    onSuccess: () => setDeleteTarget(null),
  });

  const allUsers = usersQuery.data?.data ?? [];

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return allUsers;

    return allUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.user_id.toLowerCase().includes(keyword) ||
        ROLE_LABEL[user.app_role].toLowerCase().includes(keyword)
      );
    });
  }, [allUsers, search]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PER_PAGE));

  useEffect(() => {
    if (page > pageCount - 1) {
      setPage(Math.max(0, pageCount - 1));
    }
  }, [page, pageCount]);

  const paginatedUsers = useMemo(() => {
    const start = page * PER_PAGE;
    return filteredUsers.slice(start, start + PER_PAGE);
  }, [filteredUsers, page]);

  const openCreate = useCallback(() => {
    form.reset(DEFAULT_USER_FORM_VALUES);
    setSelectedUser(null);
    setModalMode("create");
  }, [form]);

  const openEdit = useCallback(
    (user: UserPayload) => {
      form.reset({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        app_role: user.app_role,
      });
      setSelectedUser(user);
      setModalMode("edit");
    },
    [form],
  );

  const openDetail = useCallback((user: UserPayload) => {
    setSelectedUser(user);
    setModalMode("detail");
  }, []);

  const onSubmit = useCallback(
    (data: UserFormData) => {
      if (modalMode === "create") {
        createMutation.mutate(data);
        return;
      }

      if (modalMode === "edit" && selectedUser) {
        updateMutation.mutate({
          id: selectedUser._id,
          payload: {
            name: data.name,
            email: data.email,
            app_role: data.app_role,
          },
        });
      }
    },
    [createMutation, modalMode, selectedUser, updateMutation],
  );

  const columns = useMemo(
    () =>
      getUserColumns({
        onDetail: openDetail,
        onEdit: openEdit,
        onDelete: setDeleteTarget,
      }),
    [openDetail, openEdit],
  );

  const detailRows = useMemo(
    () => (selectedUser ? getUserDetailRows(selectedUser) : []),
    [selectedUser],
  );

  return {
    columns,
    data: paginatedUsers,
    totalItems: filteredUsers.length,
    pageCount,
    page,
    perPage: PER_PAGE,
    search,
    modalMode,
    selectedUser,
    deleteTarget,
    detailRows,
    isLoading: usersQuery.isLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    form,
    openCreate,
    openEdit,
    openDetail,
    closeModal,
    setPage,
    setSearch,
    setDeleteTarget,
    handleSubmit: form.handleSubmit(onSubmit),
    confirmDelete: () =>
      deleteTarget && deleteMutation.mutate(deleteTarget._id),
  };
}

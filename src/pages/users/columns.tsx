import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserPayload } from "@/services/users.service";

type UserColumnsProps = {
  onDetail: (user: UserPayload) => void;
  onEdit: (user: UserPayload) => void;
  onDelete: (user: UserPayload) => void;
};

const ROLE_BADGE_CLASS: Record<UserPayload["app_role"], string> = {
  tenant_admin:
    "bg-[rgba(250,173,20,0.15)] text-[#B06A00] border-[rgba(250,173,20,0.35)]",
  supervisor:
    "bg-[rgba(24,144,255,0.14)] text-[#0958D9] border-[rgba(24,144,255,0.35)]",
  guard:
    "bg-[rgba(82,196,26,0.14)] text-[#237804] border-[rgba(82,196,26,0.35)]",
  auditor:
    "bg-[rgba(114,46,209,0.14)] text-[#531DAB] border-[rgba(114,46,209,0.35)]",
};

const ROLE_LABEL: Record<UserPayload["app_role"], string> = {
  tenant_admin: "Tenant Admin",
  supervisor: "Supervisor",
  guard: "Guard",
  auditor: "Auditor",
};

export function getUserColumns({
  onDetail,
  onEdit,
  onDelete,
}: UserColumnsProps): ColumnDef<UserPayload>[] {
  return [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "user_id",
      header: "User ID",
      cell: ({ row }) => (
        <span className="text-[12px] font-mono bg-[#F5F5F5] px-2 py-0.5 rounded-[4px]">
          {row.original.user_id}
        </span>
      ),
    },
    {
      accessorKey: "app_role",
      header: "Role",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${ROLE_BADGE_CLASS[row.original.app_role]}`}
        >
          {ROLE_LABEL[row.original.app_role]}
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
            <DropdownMenuItem onClick={() => onDetail(row.original)}>
              <Eye className="size-4 mr-2" /> Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit className="size-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(row.original)}
              className="text-[#FB2C36] focus:text-[#FB2C36] focus:bg-[rgba(251,44,54,0.08)]"
            >
              <Trash2 className="size-4 mr-2" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

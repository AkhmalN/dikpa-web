import { StatusBadge } from "@/components/shared/DataTable";
import type { Assignment } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { ASSIGMENT_STATUS_LABEL } from "./use-assigment-page";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

interface UseAssignmentColumnsParams {
  openDetail: (assignment: Assignment) => void;
  openEdit: (assignment: Assignment) => void;
  setDeleteTarget: (assignment: Assignment | null) => void;
}

export function useAssignmentColumns({
  openDetail,
  openEdit,
  setDeleteTarget,
}: UseAssignmentColumnsParams) {
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
          <StatusBadge
            status={row.original.status}
            labels={ASSIGMENT_STATUS_LABEL}
          />
        ),
      },

      {
        accessorKey: "created_at",
        header: "Dibuat",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-[13px]">
            {format(parseISO(row.original.createdAt), "dd MMM yyyy", {
              locale: localeId,
            })}
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
        accessorKey: "shift",
        header: "Waktu Shift",
        cell: ({ row }) => {
          const { shift_start_time, shift_end_time } = row.original;
          if (!shift_start_time || !shift_end_time) {
            return <span className="text-muted-foreground">—</span>;
          }

          return (
            <span className="text-muted-foreground text-[13px]">
              {shift_start_time} - {shift_end_time}
            </span>
          );
        },
      },
      {
        accessorKey: "duty_date",
        header: "Tanggal Tugas",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-[13px]">
            {row.original.duty_date
              ? format(parseISO(row.original.duty_date), "dd MMM yyyy", {
                  locale: localeId,
                })
              : "—"}
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
    [openDetail, openEdit, setDeleteTarget],
  );

  return columns;
}

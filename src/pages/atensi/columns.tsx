import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Atensi } from "@/types/atensi.types";

type AtensiColumnsProps = {
  onDetail: (atensi: Atensi) => void;
  onEdit: (atensi: Atensi) => void;
  onDelete: (atensi: Atensi) => void;
  shiftNameMap: Record<string, string>;
  checkpointNameMap: Record<string, string>;
};

export function getAtensiColumns({
  onDetail,
  onEdit,
  onDelete,
  shiftNameMap,
  checkpointNameMap,
}: AtensiColumnsProps): ColumnDef<Atensi>[] {
  return [
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "shift_id",
      header: "Shift",
      cell: ({ row }) => (
        <span className="text-[13px]">
          {shiftNameMap[row.original.shift_id] || row.original.shift_id}
        </span>
      ),
    },
    {
      accessorKey: "checkpoint_id",
      header: "Checkpoint",
      cell: ({ row }) => {
        if (!row.original.checkpoint_id) {
          return (
            <span className="text-muted-foreground text-[13px]">
              Semua Checkpoint
            </span>
          );
        }
        return (
          <span className="text-[13px]">
            {checkpointNameMap[row.original.checkpoint_id] ||
              row.original.checkpoint_id}
          </span>
        );
      },
    },
    {
      accessorKey: "expires_at",
      header: "Kadaluarsa",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-[13px]">
          {format(parseISO(row.original.expires_at), "dd MMM yyyy, HH:mm", {
            locale: localeId,
          })}
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
      header: "Aksi",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="h-7 w-7">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => onDetail(row.original)}
              className="text-[13px]"
            >
              <Eye className="size-3.5 mr-2" /> Detail
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(row.original)}
              className="text-[13px]"
            >
              <Edit className="size-3.5 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(row.original)}
              className="text-[13px] text-[#FB2C36]"
            >
              <Trash2 className="size-3.5 mr-2" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

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
import type { Shift } from "@/types";

// function getShiftDurationLabel(startTime: string, endTime: string) {
//   const [startHour, startMinute] = startTime.split(":").map(Number);
//   const [endHour, endMinute] = endTime.split(":").map(Number);

//   let durationInMinutes =
//     endHour * 60 + endMinute - (startHour * 60 + startMinute);

//   if (durationInMinutes < 0) {
//     durationInMinutes += 24 * 60;
//   }

//   const hours = Math.floor(durationInMinutes / 60);
//   const minutes = durationInMinutes % 60;

//   return `${hours}j ${minutes}m`;
// }

type ShiftColumnsProps = {
  onDetail: (shift: Shift) => void;
  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
};

export function getShiftColumns({
  onDetail,
  onEdit,
  onDelete,
}: ShiftColumnsProps): ColumnDef<Shift>[] {
  return [
    {
      accessorKey: "shift_name",
      header: "Nama Shift",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.shift_name}
        </span>
      ),
    },
    {
      accessorKey: "shift_start_time",
      header: "Waktu Mulai",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] bg-[#F5F5F5] px-2 py-0.5 rounded-[4px]">
          {row.original.shift_start_time}
        </span>
      ),
    },
    {
      accessorKey: "shift_end_time",
      header: "Waktu Selesai",
      cell: ({ row }) => (
        <span className="font-mono text-[13px] bg-[#F5F5F5] px-2 py-0.5 rounded-[4px]">
          {row.original.shift_end_time}
        </span>
      ),
    },
    // {
    //   id: "duration",
    //   header: "Durasi",
    //   cell: ({ row }) => (
    //     <span className="text-muted-foreground text-[13px]">
    //       {getShiftDurationLabel(
    //         row.original.shift_start_time,
    //         row.original.shift_end_time,
    //       )}
    //     </span>
    //   ),
    // },
    {
      accessorKey: "createdAt",
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
      id: "actions",
      header: "Aksi",
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

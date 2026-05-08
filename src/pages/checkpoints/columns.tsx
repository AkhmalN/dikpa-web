import type { Checkpoint } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  QrCode,
  Trash2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CheckpointColumnsProps = {
  openDetail: (checkpoint: Checkpoint) => void;
  openEdit: (checkpoint: Checkpoint) => void;
  setDeleteTarget: (checkpoint: Checkpoint | null) => void;
  openPrintQr: (checkpoint: Checkpoint) => void;
};

export const getCheckpointColumns = ({
  openDetail,
  openEdit,
  setDeleteTarget,
  openPrintQr,
}: CheckpointColumnsProps): ColumnDef<Checkpoint>[] => [
  {
    accessorKey: "name",
    header: "Nama Checkpoint",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[4px] bg-[rgba(0,184,219,0.1)] flex items-center justify-center flex-shrink-0">
          <MapPin className="size-3.5 text-[#00B8DB]" />
        </div>
        <span className="font-medium text-foreground">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "qr_code_value",
    header: "QR Code",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => openPrintQr(row.original)}
              >
                <QrCode className="size-3.5 cursor-pointer" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Download QR</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-[12px] font-mono bg-[#F5F5F5] px-2 py-0.5 rounded-[4px]">
          {row.original.qr_code_value}
        </span>
      </div>
    ),
  },
  {
    id: "coordinates",
    header: "Koordinat",
    cell: ({ row }) => (
      <span className="text-[12px] font-mono text-muted-foreground">
        {row.original.gps_lat.toFixed(4)}, {row.original.gps_lon.toFixed(4)}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => (
      <span className="text-[13px] text-muted-foreground truncate max-w-[180px] block">
        {row.original.description || "—"}
      </span>
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
];

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  totalItems?: number;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  filterComponent?: React.ReactNode;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  emptyMessage?: string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  totalItems,
  searchPlaceholder = "Cari...",
  onSearchChange,
  searchValue,
  filterComponent,
  pagination,
  emptyMessage = "Tidak ada data",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination: pagination
        ? { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
        : internalPagination,
    },
    pageCount: pagination?.pageCount ?? Math.ceil((totalItems || data.length) / (internalPagination.pageSize)),
    manualPagination: !!pagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: pagination ? undefined : setInternalPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
  });

  const currentPage = pagination ? pagination.pageIndex : internalPagination.pageIndex;
  const pageCount = pagination?.pageCount ?? table.getPageCount();
  const canPrevious = currentPage > 0;
  const canNext = currentPage < pageCount - 1;

  const handlePrev = () => {
    if (pagination) pagination.onPageChange(currentPage - 1);
    else setInternalPagination(p => ({ ...p, pageIndex: p.pageIndex - 1 }));
  };
  const handleNext = () => {
    if (pagination) pagination.onPageChange(currentPage + 1);
    else setInternalPagination(p => ({ ...p, pageIndex: p.pageIndex + 1 }));
  };
  const handleFirst = () => {
    if (pagination) pagination.onPageChange(0);
    else setInternalPagination(p => ({ ...p, pageIndex: 0 }));
  };
  const handleLast = () => {
    if (pagination) pagination.onPageChange(pageCount - 1);
    else setInternalPagination(p => ({ ...p, pageIndex: pageCount - 1 }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      {(onSearchChange || filterComponent) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {onSearchChange && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue ?? ""}
                onChange={e => onSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          )}
          {filterComponent && <div className="flex items-center gap-2">{filterComponent}</div>}
        </div>
      )}

      {/* Table */}
      <div className="rounded-[6px] border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id} className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                {hg.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="text-[12px] font-bold text-foreground leading-[15px] py-3 px-4 whitespace-nowrap cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && <span className="text-primary">↑</span>}
                      {header.column.getIsSorted() === "desc" && <span className="text-primary">↓</span>}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, ci) => (
                    <TableCell key={ci} className="py-4 px-4">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-[14px]">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="hover:bg-[#F5F5F5] border-b border-border">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-4 px-4 text-[14px] text-foreground leading-[21px]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[12px] text-muted-foreground">
        <span>
          {totalItems !== undefined
            ? `${totalItems} total data`
            : `${table.getFilteredRowModel().rows.length} data`}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={handleFirst} disabled={!canPrevious || isLoading}>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handlePrev} disabled={!canPrevious || isLoading}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="px-2 text-[12px]">
            Hal {currentPage + 1} / {pageCount || 1}
          </span>
          <Button variant="ghost" size="icon-sm" onClick={handleNext} disabled={!canNext || isLoading}>
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleLast} disabled={!canNext || isLoading}>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Status badge helper
export function StatusBadge({ status, labels }: { status: string; labels: Record<string, { label: string; className: string }> }) {
  const cfg = labels[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center rounded-[800px] px-3 py-1 text-[11px] font-bold leading-[11px] border", cfg.className)}>
      {cfg.label}
    </span>
  );
}

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  type LucideIcon,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/common/EmptyState"
import { cn } from "cn"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  searchKey?: string // optional specific column accessor to search, otherwise uses global filter
  filterSlot?: React.ReactNode
  initialPageSize?: number
  pageSizeOptions?: number[]
  emptyIcon?: LucideIcon
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
  loading?: boolean
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey,
  filterSlot,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  emptyIcon = Inbox,
  emptyTitle = "No records found",
  emptyDescription = "There are no records available to display at this time.",
  emptyAction,
  loading = false,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState<string>("")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  // TanStack table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchKey ? undefined : globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Specific column filter or global filter value
  const searchValue = searchKey
    ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
    : globalFilter

  const handleSearchChange = (value: string) => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value)
    } else {
      setGlobalFilter(value)
    }
  }

  const handleClearSearch = () => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue("")
    } else {
      setGlobalFilter("")
    }
  }

  const totalRows = table.getFilteredRowModel().rows.length
  const pageStart = pagination.pageIndex * pagination.pageSize + 1
  const pageEnd = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows)

  return (
    <div className={cn("space-y-3", className)}>
      {/* Table Toolbar (Search Box & Optional Filter Slot) */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
            strokeWidth={1.75}
          />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8.5 pr-8.5 h-8 text-xs bg-card border-border/80 focus-visible:ring-1"
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-4.5 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="size-3" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {filterSlot && (
          <div className="flex items-center gap-2 flex-wrap">{filterSlot}</div>
        )}
      </div>

      {/* Horizontal Scroll Table Container */}
      <div className="relative w-full overflow-x-auto rounded-lg border border-border/70 bg-card shadow-xs">
        <Table className="w-full caption-bottom text-sm border-collapse">
          {/* Header Row: Muted tint, 11px/500 uppercase labels, no green text */}
          <TableHeader className="bg-muted/40 border-b border-border/70">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border/70 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const isSorted = header.column.getIsSorted()

                  return (
                    <TableHead
                      key={header.id}
                      className="h-9 px-3.5 text-left align-middle text-[11px] font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none"
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="group inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors cursor-pointer"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <span className="shrink-0 text-muted-foreground/70 group-hover:text-foreground transition-colors">
                            {isSorted === "asc" ? (
                              <ArrowUp className="size-3 text-foreground" strokeWidth={2} />
                            ) : isSorted === "desc" ? (
                              <ArrowDown className="size-3 text-foreground" strokeWidth={2} />
                            ) : (
                              <ArrowUpDown className="size-3 opacity-50 group-hover:opacity-100" strokeWidth={1.75} />
                            )}
                          </span>
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Table Body: Compact 38-40px rows, hairline row dividers, no vertical cell borders */}
          <TableBody>
            {loading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="h-9.5 border-b border-border/40 hover:bg-transparent"
                >
                  {columns.map((_, colIndex) => (
                    <TableCell key={`skeleton-cell-${colIndex}`} className="px-3.5 py-1.5">
                      <Skeleton className="h-3.5 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-9.5 sm:h-10 border-b border-border/40 transition-colors hover:bg-muted/30 focus-within:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3.5 py-1.5 align-middle text-[13px] text-foreground whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Built-in EmptyState for zero rows
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 p-0 text-center"
                >
                  {searchValue ? (
                    <EmptyState
                      icon={Search}
                      title="No matching records found"
                      description={`No results matching "${searchValue}". Try checking your spelling or clear the filter.`}
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearSearch}
                          className="h-8 text-xs font-medium"
                        >
                          Clear search filter
                        </Button>
                      }
                    />
                  ) : (
                    <EmptyState
                      icon={emptyIcon}
                      title={emptyTitle}
                      description={emptyDescription}
                      action={emptyAction}
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer: Compact rows per page + navigation */}
      <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
        {/* Row count summary */}
        <div className="flex items-center gap-2">
          {totalRows > 0 ? (
            <span>
              Showing <span className="font-medium text-foreground">{pageStart}</span> to{" "}
              <span className="font-medium text-foreground">{pageEnd}</span> of{" "}
              <span className="font-medium text-foreground">{totalRows}</span> records
            </span>
          ) : (
            <span>0 records available</span>
          )}
        </div>

        {/* Page size select & navigation buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(val) => {
                if (val) {
                  table.setPageSize(Number(val))
                }
              }}
            >
              <SelectTrigger size="sm" className="h-7 w-16 text-xs bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 font-medium">
            <span>
              Page {totalRows === 0 ? 0 : pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="size-7"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-3.5" strokeWidth={1.75} />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="size-7"
              aria-label="Next page"
            >
              <ChevronRight className="size-3.5" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

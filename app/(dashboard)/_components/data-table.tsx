"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMedia } from "react-use"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const DataTable = <TData, TValue> ({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: {
            pageSize: 5,
        },
    },
  })

  const isMobile = useMedia("(max-width: 1280px)", false);

  return (
    <div className="size-full relative">
        <div className="border-b">
        <Table>
            <TableHeader className="2xl:h-12 2k:h-14 4k:h-16">
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id} className="max-md:text-center">
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="max-w-20 md:max-w-32 lg:max-w-40 xl:max-w-52 2xl:max-w-96 4k:max-w-[600px] max-lg:h-11 xl:h-14 2k:h-18 4k:h-22 overflow-hidden text-ellipsis whitespace-nowrap">
                        {
                            !isMobile ?
                            <HoverCard>
                            <HoverCardTrigger asChild>
                            <Button
                            variant='ghost'
                            className="hover:!bg-transparent hover:!text-inherit block h-full max-w-20 md:max-w-32 lg:max-w-40 xl:max-w-52 2xl:max-w-96 4k:max-w-[600px] p-0 2k:text-lg 4k:text-xl text-left overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64 md:w-96 break-all 2k:text-lg 4k:text-xl">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </HoverCardContent>
                            </HoverCard> :
                            <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                variant='ghost'
                                className="hover:!bg-transparent hover:!text-inherit block size-full p-0 2k:text-lg text-left overflow-hidden text-ellipsis whitespace-nowrap"
                                >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader className="flex flex-col items-center justify-center">
                                <DialogTitle className="text-lg font-semibold">
                                    {cell.column.columnDef.header as string}
                                </DialogTitle>
                                <DialogDescription className="break-all flex items-center justify-center">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        }
                        
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 p-1 absolute bottom-0 right-0">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Next
            </Button>
        </div>
    </div>
    
  )
}

export default DataTable;
"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,
} from "@tanstack/react-table";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        columnResizeMode: "onChange",
    });

    return (
        <div className="rounded-md  h-screen overflow-auto">
            <div className="flex gap-2 items-center justify-normal bg-white">
                <div className="flex items-center w-[30%] py-4">
                    <label htmlFor="" className="px-2 whitespace-nowrap ">
                        اسم العميل
                    </label>
                    <Input
                        className="flex-1 bg-slate-500 text-black placeholder:text-white"
                        placeholder="ابحث عن العميل بالاسم"
                        value={
                            (table
                                .getColumn("اسم العميل")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("اسم العميل")
                                ?.setFilterValue(event.target.value)
                        }
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default" className="ml-auto bg-black ">
                            الاعمدة
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        dir="rtl"
                                        key={column.id}
                                        className="capitalize "
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Table
                className={`bg-white rounded-lg w-[${table.getTotalSize()}] mx-auto rtl`}
                dir="rtl"
            >
                <TableHeader className="bg-slate-300 " dir="rtl">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className={`font-bold group relative text-black text-lg text-center mx-auto  `}
                                        colSpan={header.colSpan}
                                        style={{
                                            width: `${header.getSize()}px`,
                                        }}
                                    >
                                        <span
                                            className="absolute top-0 right-0 w-1 rounded-full bg-transparent h-full group-hover:bg-red-500 cursor-col-resize select-none touch-none"
                                            onMouseDown={header.getResizeHandler()}
                                            onTouchStart={header.getResizeHandler()}
                                            style={{
                                                transform:
                                                    header.column.getIsResizing()
                                                        ? `translateX(${
                                                              table.getState()
                                                                  .columnSizingInfo
                                                                  .deltaOffset
                                                          }px)`
                                                        : "",
                                            }}
                                        />
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
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
                                className="p-0 border-b-2 border-blue-200 hover:bg-blue-100 duration-75"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="p-[2px] font-bold text-center text-lg"
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
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                لا يوجد فواتير
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end gap-2 space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    السابق
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    التالي
                </Button>
            </div>
        </div>
    );
}

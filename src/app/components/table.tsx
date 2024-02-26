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
    ColumnResizeDirection,
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
    filterlabel: string;
    filterAccessorKey: string;
    filterplaceholder: string;
    notfound: string;
    visabilty?: boolean;
}

export function TableUi<TData, TValue>({
    columns,
    data,
    filterAccessorKey,
    filterlabel,
    filterplaceholder,
    notfound,
    visabilty,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );

    const [columnResizeDirection, setColumnResizeDirection] =
        useState<ColumnResizeDirection>("rtl");

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
        columnResizeDirection,
    });

    return (
        <div className="rounded-md  h-screen overflow-auto">
            <div className="flex gap-2 items-center justify-normal bg-white mt-1 rounded-lg">
                <div className="flex items-center w-[30%] py-4 relative mr-2">
                    <legend className="px-2 top-0 w-fit bg-white right-3 absolute whitespace-nowrap text-lg font-extrabold ">
                        {filterlabel}
                    </legend>
                    <Input
                        className="flex-1  outline-none text-black
                         placeholder:text-white bg-white border-red-500 border-4"
                        placeholder={filterplaceholder}
                        value={
                            (table
                                .getColumn(filterAccessorKey)
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn(filterAccessorKey)
                                ?.setFilterValue(event.target.value)
                        }
                    />
                </div>
                {/* {visabilty && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="default"
                                className="ml-auto bg-black "
                            >
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
                )} */}
            </div>
            <Table
                className={` mt-3 rounded-lg overflow-hidden w-[${table.getTotalSize()}] mx-auto rtl`}
                dir="rtl"
            >
                <TableHeader className="bg-slate-500  " dir="rtl">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className={`font-bold group  text-white  relative  text-lg text-center mx-auto  `}
                                        colSpan={header.colSpan}
                                        style={{
                                            width: `${header.getSize()}px`,
                                        }}
                                    >
                                        <span
                                            className={`absolute top-0 left-0 w-[5px] rounded-full  h-full bg-red-500 group-hover:opacity-100 cursor-col-resize select-none touch-none opacity-0 hover:opacity-100  ${
                                                header.column.getIsResizing()
                                                    ? "opacity-100"
                                                    : null
                                            }`}
                                            onMouseDown={header.getResizeHandler()}
                                            onTouchStart={header.getResizeHandler()}
                                            onDoubleClick={() =>
                                                header.column.resetSize()
                                            }
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
                <TableBody className="bg-white">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="odd:bg-white even:bg-slate-200 p-0 border-b-2 rounded-lg border-blue-200 hover:bg-blue-300 "
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="p-[2px] font-bold text-center text-lg border-2 border-t-0 border-blue-200"
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
                                className={`h-24 text-center w-full `}
                            >
                                {notfound}
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

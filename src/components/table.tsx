"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    ColumnResizeDirection,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterEnabled?: boolean;
    filterlabel: string;
    filterAccessorKey: string;
    filterplaceholder: string;
    notfound: string;
    visabilty?: boolean;
    reversedNavButton?: boolean;
}

export function TableUi<TData, TValue>({
    columns,
    data,
    filterAccessorKey,
    filterlabel,
    filterplaceholder,
    filterEnabled = true,
    notfound,
    visabilty,
    reversedNavButton,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnResizeDirection, setColumnResizeDirection] =
        useState<ColumnResizeDirection>("rtl");

    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            columnVisibility,
            sorting,
        },
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 15,
            },
        },
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        columnResizeMode: "onChange",
        columnResizeDirection,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className=" max-w-5xl mx-auto">
            <div className="flex gap-2 items-center justify-normal  mt-1 ">
                {filterEnabled && (
                    <div className="flex items-center w-[30%] py-4 relative mr-2 ">
                        <legend className="px-2 -top-1 w-fit  right-3 absolute whitespace-nowrap text-lg bg-white font-extrabold ">
                            {filterlabel}
                        </legend>
                        <Input
                            className="flex-1  outline-none text-black  shadow-md
                         placeholder:text-white  border-sky-400 border-4 text-lg"
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
                )}
            </div>
            <div
                className={`shadow-sm relative max-w-[${table.getTotalSize()}px]`}
            >
                <div className="flex absolute -top-11 left-0 z-10 items-center justify-end gap-2  py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="bg-sky-400 text-lg shadow-md select-none"
                    >
                        {reversedNavButton ? "التالي" : "السابق"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="bg-sky-400 text-lg shadow-md select-none"
                    >
                        {reversedNavButton ? "السابق" : "التالي"}
                    </Button>
                </div>
                <Table
                    className={` mt-3   bg-[#fafafa] border border-stone-300 overflow-hidden  w-full rtl`}
                    dir="rtl"
                >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`font-bold px-0 hover:bg-slate-400 hover:tew group border border-stone-300  text-black  relative  text-lg text-center mx-auto  `}
                                            colSpan={header.colSpan}
                                            style={{
                                                width: `${header.getSize()}px`,
                                            }}
                                        >
                                            <span
                                                className={`absolute top-0 left-0 w-[5px] z-50   h-full bg-sky-500 group-hover:opacity-100 cursor-col-resize select-none touch-none opacity-0 hover:opacity-100  ${
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
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className=" p-0 border-b-2 rounded-lg hover:bg-sky-400 "
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="p-[2px] font-bold text-center text-lg border border-t-0 border-stone-300"
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
                                    colSpan={8}
                                    className={`h-24 text-center w-full font-bold text-xl `}
                                >
                                    {notfound}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

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
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterEnabled?: boolean;
    filterlabel?: string;
    filterAccessorKey?: string;
    filterplaceholder?: string;
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
        <div className=" max-w-5xl mx-auto ">
            <div className="flex gap-2 items-center justify-normal  mt-1 ">
                {filterEnabled && (
                    <div className="flex items-center w-full sm:w-[250px] py-4 relative">
                        <legend className="px-2 top-0 w-fit  right-3 absolute whitespace-nowrap sm:text-lg bg-[#fafafa] rounded-md font-extrabold ">
                            {filterlabel}
                        </legend>
                        <Input
                            className="flex-1 bg-[#fafafa] outline-none text-black  shadow-md
                           border-sky-400 sm:border-2 text-lg placeholder:text-black/70"
                            placeholder={filterplaceholder}
                            value={
                                (table
                                    .getColumn(filterAccessorKey!)
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn(filterAccessorKey!)
                                    ?.setFilterValue(event.target.value)
                            }
                        />
                    </div>
                )}
            </div>
            <div className="w-full relative border sm:border-none shadow-md sm:shadow-none border-black mt-4 py-2 ">
                <div className="flex w-full absolute -top-9  z-10 items-center justify-end gap-2 ">
                    <Button
                        variant={"ghost"}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="p-0 mt-0"
                    >
                        <ArrowBigRight className="bg-sky-400 text-sm rounded-full p-1 w-8 h-8  shadow-md select-none" />
                    </Button>
                    <Button
                        variant={"ghost"}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="p-0 mt-0"
                    >
                        <ArrowBigLeft className="bg-sky-400 text-sm rounded-full p-1 w-8 h-8  shadow-md select-none" />
                    </Button>
                </div>
                <div className={`  max-w-full  relative px-2 sm:px-0  `}>
                    <div className=" overflow-x-auto border border-stone-300">
                        <div className="min-w-[700px]  ">
                            <Table
                                className={`  bg-[#fafafa] border-none overflow-hidden  w-full rtl`}
                                dir="rtl"
                            >
                                <TableHeader>
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <TableHead
                                                                key={header.id}
                                                                className={`font-bold p-0 hover:bg-slate-400 border-t-0 group border border-stone-300  text-black  relative  sm:text-lg text-center mx-auto  h-fit py-1`}
                                                                colSpan={
                                                                    header.colSpan
                                                                }
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
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .header,
                                                                          header.getContext()
                                                                      )}
                                                            </TableHead>
                                                        );
                                                    }
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody className="bg-white">
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={
                                                    row.getIsSelected() &&
                                                    "selected"
                                                }
                                                className=" p-0 border-b-2 rounded-lg hover:bg-sky-400 "
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="p-[2px] font-bold text-center sm:text-lg border border-t-0 border-stone-300"
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
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
                                                className={`sm:h-24 text-center w-full font-bold text-xl `}
                                            >
                                                {notfound}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

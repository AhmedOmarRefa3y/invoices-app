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
  loading?: boolean;
  setPage: (page: number) => void;
  Page: number;
  maxPage: number;
  itemsPerPage: number;
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
  maxPage,
  loading,
  setPage,
  Page,
  itemsPerPage,
}: DataTableProps<TData, TValue>) {
  const [columnResizeDirection, setColumnResizeDirection] =
    useState<ColumnResizeDirection>("rtl");
  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: itemsPerPage,
      },
    },
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
    columnResizeDirection,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="  mx-auto  flex-1 flex flex-col max-h-[900px] max-w-full relative  p-2 sm:px-0 h-full  ">
      <div className="overflow-x-auto   border border-stone-300 print:border-black rounded-md print:rounded-none">
        <Table
          className={`bg-[#fafafa]  overflow-hidden  whitespace-nowrap`}
          dir="ltr"
        >
          <TableHeader className="print:border-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-stone-300 ">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={` p-0 px-1  hover:bg-slate-400  group  rtl:border-r ltr:border-r ltr:first:border-r-0 rtl:first:border-r-0  text-muted-foreground  relative min-w-fit whitespace-nowrap font-bold   text-center mx-auto   h-[40px] text-black text-lg border-stone-300 print:border print:border-black `}
                      colSpan={header.colSpan}
                      style={{
                        width: `${header.getSize()}px`,
                      }}
                    >
                      <span
                        className={`absolute top-0 left-0 w-[5px] z-50  h-full bg-sky-500 group-hover:opacity-100 cursor-col-resize select-none touch-none opacity-0 hover:opacity-100  ${
                          header.column.getIsResizing() ? "opacity-100" : null
                        }`}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => header.column.resetSize()}
                      />
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {/* {table.getRowModel().rows?.length && !loading ? ( */}
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className=" p-0  hover:bg-sky-400  border-stone-300 print:border-black"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="p-0 px-2 font-bold text-center ltr:border-l ltr:first:border-l-0 rtl:border-r rtl:first:border-r-0 w-fit text-lg border-stone-300 print:border-black print:border"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {table.getRowModel().rows.length < 1 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className={`sm:h-24 text-center w-full font-bold text-xl `}
                >
                  {notfound}
                </TableCell>
              </TableRow>
            )}
            {loading &&
              new Array(10).fill(0).map((_, i) => (
                <TableRow
                  key={i}
                  className="animate-pulse bg-slate-300 py-2 h-[45px]"
                >
                  <TableCell colSpan={8}></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-2 mt-auto py-2 justify-end print:hidden">
        <Button
          variant={"ghost"}
          onClick={() => setPage(Page + 1)}
          disabled={Page + 1 > maxPage ? true : false}
          className="p-2 mt-0 border border-stone-300 font-light"
        >
          Next
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => setPage(Page - 1)}
          disabled={Page - 1 < 1 ? true : false}
          className="p-2 mt-0 border border-stone-300 font-light"
        >
          Previous
        </Button>
      </div>
    </div>
  );
}

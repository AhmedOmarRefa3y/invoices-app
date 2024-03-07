"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

export type INitaliListColumnsT = {
    productName: string;
    id: string;
    initalQuantity: number;
    unit: string;
};

export const INitaliListColumns: ColumnDef<INitaliListColumnsT>[] = [
    {
        accessorKey: "productName",
        header: ({ header }) => {
            return <div className="">اسم الصنف</div>;
        },
        size: 700,
        cell: ({ row }) => {
            return (
                <Link href={`/inventory/product-records/${row.original.id}`}>
                    {row.original.productName}
                </Link>
            );
        },
    },
    {
        accessorKey: "initalQuantity",
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <div
                            onClick={() => {
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                );
                            }}
                        >
                            اول المدة
                        </div>
                        <div className="flex flex-col items-center relative">
                            <FaCaretUp
                                className={` text-xl  hover:text-red-500 ${
                                    column.getIsSorted() === "desc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "desc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(true);
                                    }
                                }}
                            />
                            <FaCaretDown
                                className={` text-xl  hover:text-red-500 ${
                                    column.getIsSorted() === "asc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "asc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        },
        size: 50,
        cell: ({ row }) => {
            return row.original.initalQuantity.toLocaleString("ar-EG", {
                useGrouping: false,
            });
        },
    },
];

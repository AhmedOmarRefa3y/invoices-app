"use client";

import { Part } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUp10, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { TbFilterOff } from "react-icons/tb";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type inventoryT = {
    productName: string;
    id: string;
    initalQuantity: number;
    soldQuantity: number;
    returnedQuantity: number;
    producedQuantity: number;
    outProduction: number;
    availableQuantity: number;
    isAcomposistion?: boolean;
    parts?: Part[];
    unit: string;
};

export const inventoryColumns: ColumnDef<inventoryT>[] = [
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
        accessorKey: "producedQuantity",
        header: ({ header }) => {
            return <div>اول المدة</div>;
        },
        size: 50,
        cell: ({ row }) => {
            return row.original.initalQuantity.toLocaleString("ar-EG", {
                useGrouping: false,
            });
        },
    },
    {
        accessorKey: "producedQuantity",
        header: ({ header }) => {
            return <div>الكمية المنتجة</div>;
        },
        size: 50,

        cell: ({ row }) => {
            return (
                <div>
                    {row.original.producedQuantity.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "outProduction",
        header: ({ header }) => {
            return <div>المنصرف للانتاج</div>;
        },
        size: 50,

        cell: ({ row }) => {
            return (
                <div>
                    {row.original.outProduction.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "returnedQuantity",
        header: ({ header }) => {
            return <div>الكمية المرتجعة</div>;
        },
        size: 50,

        cell: ({ row }) => {
            return (
                <div>
                    {row.original.returnedQuantity.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "soldQuantity",
        header: ({ column }) => {
            return (
                <div>
                    <div className="absolute top-0 left-3 z-30 text-sky-500">
                        <TbFilterOff
                            className="h-5 w-5 hover:text-red-500"
                            onClick={() => column.clearSorting()}
                        />
                    </div>
                    <div
                        className="flex px-2 items-center gap-1 select-none cursor-pointer relative w-full"
                        onClick={() => {
                            console.log(column.getIsSorted());

                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            );
                        }}
                    >
                        <div>الكمية المباعة</div>
                        <div className="flex items-center">
                            <ArrowUp
                                className={` h-6 w-4 ${
                                    column.getIsSorted() === "asc" &&
                                    "text-red-700"
                                } `}
                            />
                            <ArrowDown
                                className={` h-6 w-4 ${
                                    column.getIsSorted() === "desc" &&
                                    "text-red-700"
                                } `}
                            />
                        </div>
                    </div>
                </div>
            );
        },
        size: 50,

        cell: ({ row }) => {
            return (
                <div>
                    {row.original.soldQuantity.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "availableQuantity",
        header: ({ column }) => {
            return (
                <div>
                    <div
                        className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full"
                        // onClick={() => {
                        //     console.log(column.getIsSorted());

                        //     column.toggleSorting(
                        //         column.getIsSorted() === "asc"
                        //     );
                        // }}
                    >
                        <div>الكمية المتاحة</div>
                        <div className="flex items-center relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 hover:text-red-500 ">
                                <TbFilterOff
                                    className={`h-5 w-5 ${
                                        column.getIsSorted() === false
                                            ? "text-red-500"
                                            : null
                                    }`}
                                    onClick={() => column.clearSorting()}
                                />
                            </div>
                            <ArrowUp
                                className={` h-6 w-4 hover:text-red-500 ${
                                    column.getIsSorted() === "desc" &&
                                    "text-red-700"
                                } `}
                                onClick={() => {
                                    console.log(column.getIsSorted());

                                    column.toggleSorting(true);
                                }}
                            />
                            <ArrowDown
                                className={` h-6 w-4 hover:text-red-500 ${
                                    column.getIsSorted() === "asc" &&
                                    "text-red-700"
                                } `}
                                onClick={() => {
                                    console.log(column.getIsSorted());

                                    column.toggleSorting(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        },
        size: 50,

        cell: ({ row }) => {
            return (
                <div>
                    {row.original.availableQuantity.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                </div>
            );
        },
    },
];

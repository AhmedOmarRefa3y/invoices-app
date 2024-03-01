"use client";

import { Part } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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
        header: ({ header }) => {
            return <div>الكمية المباعة</div>;
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
        header: ({ header }) => {
            return <div>الكمية المتاحة</div>;
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

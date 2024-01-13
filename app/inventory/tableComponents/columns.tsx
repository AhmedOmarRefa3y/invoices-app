"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type inventory = {
    productName: string;
    id: string;
    Received: number;
    Issued: number;
    availableQuantity: number;
    initialQuantity: number;
};

export const inventoryColumns: ColumnDef<inventory>[] = [
    {
        accessorKey: "productId",
        header: ({ header }) => {
            return <div className="text-right">اسم الصنف</div>;
        },
        cell: ({ row }) => {
            return <div className="text-right">{row.original.productName}</div>;
        },
    },
    {
        accessorKey: "initialQuantity",
        header: ({ header }) => {
            return <div className="text-right">اول المدة</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">{row.original.initialQuantity}</div>
            );
        },
    },
    {
        accessorKey: "Received",
        header: ({ header }) => {
            return <div className="text-right">الكمية الواردة</div>;
        },
        cell: ({ row }) => {
            return <div className="text-right">{row.original.Received}</div>;
        },
    },
    {
        accessorKey: "Issued",
        header: ({ header }) => {
            return <div className="text-right">الكمية المنصرفة</div>;
        },
        cell: ({ row }) => {
            return <div className="text-right">{row.original.Issued}</div>;
        },
    },
    {
        accessorKey: "availableQuantity",
        header: ({ header }) => {
            return <div className="text-right">الكمية المتاحة</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {row.original.availableQuantity}
                </div>
            );
        },
    },
];

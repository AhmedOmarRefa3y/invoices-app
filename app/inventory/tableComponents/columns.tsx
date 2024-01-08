"use client";

import { Inventory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type inventory = {
    productName: string;
    id: string;
    soldQuantity: number;
    returnedQuantity: number;
    producedQuantity: number;
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
        accessorKey: "producedQuantity",
        header: ({ header }) => {
            return <div className="text-right">الكمية المنتجة</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {row.original.producedQuantity}
                </div>
            );
        },
    },
    {
        accessorKey: "returnedQuantity",
        header: ({ header }) => {
            return <div className="text-right">الكمية المرتجعة</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {row.original.returnedQuantity}
                </div>
            );
        },
    },
    {
        accessorKey: "soldQuantity",
        header: ({ header }) => {
            return <div className="text-right">الكمية المباعة</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">{row.original.soldQuantity}</div>
            );
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

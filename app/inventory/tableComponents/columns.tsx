"use client";

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
    availableQuantity: number;
};

export const inventoryColumns: ColumnDef<inventoryT>[] = [
    {
        accessorKey: "productId",
        header: ({ header }) => {
            return <div className="text-right">اسم الصنف</div>;
        },
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
            return <div className="text-right">اول المدة</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">{row.original.initalQuantity}</div>
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

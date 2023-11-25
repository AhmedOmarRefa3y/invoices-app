"use client";

import { Inventory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type inventory = {
    id: string;
    quantity: number;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
    product: {
        id: string;
        name: string;
        price: number;
        createdAt: Date;
        updatedAt: Date;
    };
};

export const inventoryColumns: ColumnDef<inventory>[] = [
    {
        accessorKey: "productId",
        header: ({ header }) => {
            return <div className="text-right">اسم الصنف</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">{row.original.product.name}</div>
            );
        },
    },
    {
        accessorKey: "quantity",
        header: ({ header }) => {
            return <div className="text-right">الرصيد</div>;
        },
    },
];

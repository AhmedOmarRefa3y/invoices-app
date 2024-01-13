"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type inventoryRecordsT = {
    date: Date | undefined;
    type: "out" | "in";
    recordName: string;
    quantity: number;
};

export const inventoryRecords: ColumnDef<inventoryRecordsT>[] = [
    {
        accessorKey: "date",
        header: ({ header }) => {
            return <div className="text-right">التاريخ</div>;
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {row.original.date?.toLocaleDateString()}
                </div>
            );
        },
    },
    {
        accessorKey: "recordType",
        header: ({ header }) => {
            return <div className="text-right">البيان</div>;
        },
        cell: ({ row }) => {
            return <div className="text-right">{row.original.recordName}</div>;
        },
    },
    {
        accessorKey: "quantity",
        header: ({ header }) => {
            return <div className="text-right">الكمية </div>;
        },
        cell: ({ row }) => {
            return <div className="text-right">{row.original.quantity}</div>;
        },
    },
    // {
    //     accessorKey: "Issued",
    //     header: ({ header }) => {
    //         return <div className="text-right">الكمية المنصرفة</div>;
    //     },
    //     cell: ({ row }) => {
    //         return <div className="text-right">{row.original.Issued}</div>;
    //     },
    // },
    // {
    //     accessorKey: "availableQuantity",
    //     header: ({ header }) => {
    //         return <div className="text-right">الكمية المتاحة</div>;
    //     },
    //     cell: ({ row }) => {
    //         return (
    //             <div className="text-right">
    //                 {row.original.availableQuantity}
    //             </div>
    //         );
    //     },
    // },
];

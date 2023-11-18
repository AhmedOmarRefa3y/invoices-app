"use client";

import { Button } from "@/components/ui/button";
import DeleteInvoiceBtn from "@/components/ui/deleteInvoiceBtn";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditInvoiceBtn from "@/components/ui/editInvoiceBtn";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Invoice = {
    id: string;
    customerName: string;
    customerId: string;
    date: Date;
    number: number;
    paidAmount: number | undefined;
    createdAt: Date;
    products: {
        id: string;
        name: string;
        quantity: number;
        price: number;
    }[];
};

export const columns: ColumnDef<Invoice>[] = [
    {
        accessorKey: "number",
        header: () => <div className="text-center">رقم الفاتورة</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">
                    {row.original.number}
                </div>
            );
        },
    },
    {
        accessorKey: "customerName",
        header: () => <div className="text-center">اسم العميل</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">
                    {row.original.customerName}
                </div>
            );
        },
    },
    {
        accessorKey: "date",
        header: () => <div className="text-center">التاريخ</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">
                    {row.original.date.toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            );
        },
    },

    {
        accessorKey: "products",
        header: () => <div className="text-center">اجمالي الفاتورة</div>,

        cell: ({ row }) => {
            let amount = 0;
            row.original.products.map((item) => {
                amount += item.price * item.quantity;
            });
            return (
                <div className="text-center">
                    {amount.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                    
                </div>
            );
        },
    },
    {
        accessorKey: "paidAmount",
        header: () => <div className="text-center">المدفوع</div>,

        cell: ({ row }) => {
            console.log(row.original.paidAmount);

            return (
                <div className="text-center font-medium">
                    {row.original.paidAmount
                        ? row.original.paidAmount.toLocaleString("ar-EG", {
                              useGrouping: false,
                          })
                        : ""}
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: () => <div className="text-center">تم الانشاء في</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">
                    {row.original.createdAt.toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuLabel className="flex justify-center">
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="flex justify-center">
                            <DeleteInvoiceBtn id={row.original.id} />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex justify-center">
                            <EditInvoiceBtn Invoice={row.original} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

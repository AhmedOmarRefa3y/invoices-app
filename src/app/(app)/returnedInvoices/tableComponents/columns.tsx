"use client";

import DeleteRetInvoiceBtn from "@/components/ui/DeleteRetInvoiceBtn";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditInvoiceBtn from "@/components/ui/editInvoiceBtn";
import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export type RetinvoiceCloumns = Retinvoice;



interface Retinvoice {
    id: string;
    number: number;
    customerName: string;
    date: Date;
    customer: Customer;
    amount: number;
}

export const columns: ColumnDef<Retinvoice>[] = [
    {
        accessorKey: "number",
        id: "الرقم",
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
        id: "اسم العميل",
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
        id: "التاريخ",

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
        accessorKey: "amount",
        id: "قيمة المرتجع",
        header: () => <div className="text-center">قيمة المرتجع</div>,
        cell: ({ row }) => {
            return (
                <div className=" text-center">
                    {row.original.amount.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col">
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Link
                                href={`/returnedInvoices/showREtInvoice?num=${row.original.number}`}
                                className="flex-1"
                            >
                                عرض الفاتورة
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex-1"
                        >
                            {/* <EditInvoiceBtn Invoice={row.original} /> */}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex-1"
                        >
                            <DeleteRetInvoiceBtn
                                id={row.original.id}
                                url="returnedInvoice"
                            />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

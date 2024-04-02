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

export interface Retinvoice {
    id: string;
    number: number;
    customerName: string;
    date: Date;
    customer: Customer;
    amount: number;
    orgid: string;
}

export const columns: ColumnDef<Retinvoice>[] = [
    {
        accessorKey: "number",
        id: "الرقم",
        header: () => <div className="text-center">رقم الفاتورة</div>,
        cell: ({ row }) => row.original.number,
    },
    {
        accessorKey: "customerName",
        id: "اسم العميل",
        header: () => <div className="text-center">اسم العميل</div>,
        cell: ({ row }) => row.original.customerName,
    },
    {
        accessorKey: "date",
        id: "التاريخ",

        header: () => <div className="text-center">التاريخ</div>,
        cell: ({ row }) =>
            row.original.date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
    },

    {
        accessorKey: "amount",
        id: "قيمة الفاتورة",
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
                        <DropdownMenuItem>
                            <Link
                                href={`/${row.original.orgid}/returnedInvoices/showREtInvoice?num=${row.original.number}`}
                                className="flex-1 bg-slate-300 text-center rounded-md p-2"
                            >
                                عرض الفاتورة
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex-1">
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

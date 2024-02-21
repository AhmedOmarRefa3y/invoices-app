"use client";

import { Button } from "@/components/ui/button";
import DeleteInvoiceBtn from "@/components/ui/deleteInvoiceBtn";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditInvoiceBtn from "@/components/ui/editInvoiceBtn";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

type OrderItem = Prisma.OrderItemGetPayload<{
    include: {
        Product: true;
        ProductPackage: {
            include: {
                Parts: true;
            };
        };
    };
}>;
type customer = Prisma.CustomerGetPayload<{
    include: {
        Payment: true;
    };
}>;

export interface invoiceTableT {
    id: string;
    number: number;
    customerName: string;
    Items: OrderItem[];
    date: Date;
    PaidAmount: number;
    CreatedAt: Date;
    customer: customer;
    amount: number;
}

export const columns: ColumnDef<invoiceTableT>[] = [
    {
        accessorKey: "number",
        id: "الرقم",
        size: 50,
        header: () => <div className="text-center ">رقم الفاتورة</div>,
        cell: ({ row }) => {
            return row.original.number;
        },
    },
    {
        accessorKey: "customerName",
        id: "اسم العميل",
        size: 150,
        header: () => <div className="text-center ">اسم العميل</div>,
        cell: ({ row }) => {
            return row.original.customerName;
        },
    },
    {
        accessorKey: "date",
        id: "التاريخ",
        size: 150,
        header: () => <div className="text-center">التاريخ</div>,
        cell: ({ row }) => {
            return row.original.date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
    },

    {
        accessorKey: "Items",
        id: "اجمالي الفاتورة",
        // size: 150,
        header: () => "اجمالي الفاتورة",
        cell: ({ row }) => {
            return row.original.amount.toLocaleString("ar-EG", {
                useGrouping: false,
            });
        },
    },
    {
        accessorKey: "paidAmount",
        id: "المدفوع",
        // size: 100,
        header: () => <div className="text-center">المدفوع</div>,

        cell: ({ row }) => {
            return row.original.PaidAmount
                ? row.original.PaidAmount.toLocaleString("ar-EG", {
                      useGrouping: false,
                  })
                : "";
        },
    },
    {
        accessorKey: "createdAt",
        size: 150,
        id: "تم الانشاء في",
        header: () => "تم الانشاء في",
        cell: ({ row }) => {
            return row.original.CreatedAt.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
    },
    {
        id: "actions",
        size: 50,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8  p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col">
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Link
                                href={`/invoices/sales/showInvoice?num=${row.original.number}`}
                                className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
                            >
                                عرض الفاتورة
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Link
                                className="flex-1  text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
                                href={`/invoices/sales/releaseorder?num=${row.original.number}`}
                            >
                                اذن الصرف
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex-1 "
                        >
                            <EditInvoiceBtn Invoice={row.original} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex-1"
                        >
                            <DeleteInvoiceBtn
                                id={row.original.id}
                                url="deleteinvoice"
                            />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

"use client";

import ReleaseOrder from "@/components/releaseOrder";
import { Button } from "@/components/ui/button";
import DeleteInvoiceBtn from "@/components/ui/deleteInvoiceBtn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { useRouter } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Invoice = invoice;

type LineItem = Prisma.LineItemGetPayload<{
    include: {
        invoice: true;
        product: {
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

interface invoice {
    id: string;
    number: number;
    customerName: string;
    Items: LineItem[];
    date: Date;
    PaidAmount: number;
    CreatedAt: Date;
    customer: customer;
}

export const columns: ColumnDef<Invoice>[] = [
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
        accessorKey: "products",
        id: "اجمالي الفاتورة",

        header: () => <div className="text-center">اجمالي الفاتورة</div>,
        cell: ({ row }) => {
            let amount = 0;
            row.original.Items.forEach((item) => {
                amount += item.product.price * item.quantity;
            });

            return (
                <div className=" text-center">
                    {amount.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "paidAmount",
        id: "المدفوع",

        header: () => <div className="text-center">المدفوع</div>,

        cell: ({ row }) => {
            console.log(row.original.PaidAmount);

            return (
                <div className="text-center font-medium">
                    {row.original.PaidAmount
                        ? row.original.PaidAmount.toLocaleString("ar-EG", {
                              useGrouping: false,
                          })
                        : ""}
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        id: "تم الانشاء في",
        header: () => <div className="text-center">تم الانشاء في</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">
                    {row.original.CreatedAt.toLocaleDateString("ar-EG", {
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
                                href={`/invoices/showInvoice?num=${row.original.number}`}
                                className="flex-1"
                                contentEditable
                            >
                                عرض الفاتورة
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Link
                                className="flex-1"
                                contentEditable
                                href={`/invoices/releaseorder?num=${row.original.number}`}
                            >
                                اذن الصرف
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex-1"
                            contentEditable
                        >
                            <EditInvoiceBtn Invoice={row.original} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex-1"
                        >
                            <DeleteInvoiceBtn id={row.original.id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

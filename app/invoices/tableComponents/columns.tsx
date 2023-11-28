"use client";

import InvoiceModal from "@/components/Invoice";
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Invoice = invoice;

type invoice = Prisma.InvoiceGetPayload<{
    include: {
        customer: true;
        lineItems: {
            include: {
                product: {
                    include: {
                        Parts: true;
                    };
                };
            };
        };
        payment: true;
    };
}>;

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
                    {row.original.customer.name}
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
            row.original.lineItems.forEach((item) => {
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
        header: () => <div className="text-center">المدفوع</div>,

        cell: ({ row }) => {
            console.log(row.original.payment?.amount);

            return (
                <div className="text-center font-medium">
                    {row.original.payment?.amount
                        ? row.original.payment?.amount.toLocaleString("ar-EG", {
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
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col">
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <Button
                                        variant={"default"}
                                        // className={cn("", className)}
                                        className="flex-1"
                                        contentEditable
                                    >
                                        عرض الفاتورة
                                    </Button>
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-screen-md p-0 border-2 border-black bg-red-500 bg-opacity-0">
                                <InvoiceModal invoice={row.original} />
                            </DialogContent>
                        </Dialog>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex-1"
                        >
                            <EditInvoiceBtn Invoice={row.original} />
                        </DropdownMenuItem>

                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <Button
                                        variant={"default"}
                                        // className={cn("", className)}
                                        className="flex-1"
                                        contentEditable
                                    >
                                        اذن صرف
                                    </Button>
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-screen-md p-0 border-2 border-black bg-red-500 bg-opacity-0">
                                <ReleaseOrder Invoice={row.original} />
                            </DialogContent>
                        </Dialog>
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

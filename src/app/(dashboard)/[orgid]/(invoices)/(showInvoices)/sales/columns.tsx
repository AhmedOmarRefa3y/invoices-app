"use client";

import SortableHeader from "@/components/sortableHeader";
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
    orgid: string;
}

export const columns: ColumnDef<invoiceTableT>[] = [
    {
        accessorKey: "number",
        id: "number",
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="Number" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.number;
        },
    },
    {
        accessorKey: "customerName",
        size: 300,
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="Customer" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.customerName;
        },
    },
    {
        accessorKey: "date",
        id: "Date",
        size: 200,
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="Date" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.date.toDateString();
        },
    },

    {
        accessorKey: "Items",
        id: "Total",
        size: 100,
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="Total" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.amount;
        },
    },
    {
        accessorKey: "PaidAmount",
        id: "Paid",
        size: 100,
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="Paid" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.PaidAmount ? row.original.PaidAmount : "";
        },
    },
    {
        accessorKey: "createdAt",
        size: 200,
        id: "createdAt",
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="Created At" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.CreatedAt.toDateString();
        },
    },
    {
        id: "actions",
        size: 50,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="  h-1  ">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col">
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Link
                                href={`/${row.original.orgid}/sales/showInvoice/${row.original.number}`}
                                className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
                            >
                                Show Invoice
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Link
                                className="flex-1  text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
                                href={`/${row.original.orgid}/sales/releaseorder?num=${row.original.number}`}
                            >
                                Release Order
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex-1 "
                        >
                            <EditInvoiceBtn
                                Invoice={row.original}
                                orgid={row.original.orgid}
                            />
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

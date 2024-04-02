"use client";

import { DeleteProductionORder } from "@/app/actions/production";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export interface ProductionsTableT {
    id: string;
    number: number;
    date: Date;
    CreatedAt: Date;
    orgID: string;
}

export const ProductionsTableColumns: ColumnDef<ProductionsTableT>[] = [
    {
        accessorKey: "date",
        id: "التاريخ",
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
        accessorKey: "number",
        id: "number",
        header: () => <div className="text-center ">البيان</div>,
        cell: ({ row }) => {
            return (
                <Link
                    href={`/${row.original.orgID}/production-orders/${row.original.id}`}
                >
                    امر انتاج رقم
                    <span className="px-2">
                        {" "}
                        {row.original.number.toLocaleString("ar-EG", {
                            useGrouping: false,
                        })}
                    </span>
                </Link>
            );
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
                                href={`/invoices/sales/showInvoice?num=${row.original.number}`}
                                className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
                            >
                                عرض
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Button
                                className="flex-1 text-center  h-10 px-4 py-2 rounded text-white "
                                onClick={() => {
                                    DeleteProductionORder(row.original.id);
                                }}
                                variant={"destructive"}
                            >
                                حذف
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

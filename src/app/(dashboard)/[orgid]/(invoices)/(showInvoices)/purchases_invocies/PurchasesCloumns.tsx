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
import { Customer, Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export interface PurchasesCloumnsT {
    id: string;
    number: number;
    SupplierName: string;
    date: Date;
    CreatedAt: Date;
    Supplier: Customer;
    amount: number;
    orgid: string;
}

export const PurchasesCloumns: ColumnDef<PurchasesCloumnsT>[] = [
    {
        accessorKey: "number",
        id: "number",
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="رقم الفاتورة" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.number.toLocaleString("ar-EG", {
                useGrouping: false,
            });
        },
    },
    {
        accessorKey: "SupplierName",
        size: 300,
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="اسم المورد" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.SupplierName;
        },
    },
    {
        accessorKey: "date",
        id: "التاريخ",
        size: 200,
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="التاريخ" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
    },

    {
        accessorKey: "amount",
        id: "اجمالي الفاتورة",
        size: 100,
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader
                            column={column}
                            label="اجمالي الفاتورة"
                        />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.amount.toLocaleString("ar-EG", {
                useGrouping: false,
            });
        },
    },
    // {
    //     accessorKey: "PaidAmount",
    //     id: "المدفوع",
    //     size: 100,
    //     header: ({ column }) => {
    //         return (
    //             <div>
    //                 <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
    //                     <SortableHeader column={column} label="المدفوع" />
    //                 </div>
    //             </div>
    //         );
    //     },
    //     cell: ({ row }) => {
    //         return row.original.PaidAmount
    //             ? row.original.PaidAmount.toLocaleString("ar-EG", {
    //                   useGrouping: false,
    //               })
    //             : "";
    //     },
    // },
    {
        accessorKey: "createdAt",
        size: 200,
        id: "تم الانشاء في",
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <SortableHeader column={column} label="تم الانشاء في" />
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.CreatedAt.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
    },
    // {
    //     id: "actions",
    //     size: 50,
    //     cell: ({ row }) => {
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="  h-1  ">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent className="flex flex-col">
    //                     <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    //                         <Link
    //                             href={`/${row.original.orgid}/sales/showInvoice?num=${row.original.number}`}
    //                             className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
    //                         >
    //                             عرض الفاتورة
    //                         </Link>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    //                         <Link
    //                             className="flex-1  text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
    //                             href={`/${row.original.orgid}/sales/releaseorder?num=${row.original.number}`}
    //                         >
    //                             اذن الصرف
    //                         </Link>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem
    //                         onSelect={(e) => e.preventDefault()}
    //                         className="flex-1 "
    //                     >
    //                         <EditInvoiceBtn
    //                             Invoice={row.original}
    //                             orgid={row.original.orgid}
    //                         />
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem
    //                         onSelect={(e) => e.preventDefault()}
    //                         className="flex-1"
    //                     >
    //                         <DeleteInvoiceBtn id={row.original.id} />
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];

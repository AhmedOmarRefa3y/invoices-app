"use client";
import SortableHeader from "@/components/sortableHeader";
import { Button } from "@/components/ui/button";
import DeleteCustomerBtn from "@/components/ui/deleteCustomerBtn";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";

export type TransactionT = {
    type: "Debit" | "credit" | "openCredit";
    amount: number;
    date?: Date;
    number?: number;
    label: "inv" | "paymnet" | "returns" | "openCredit" | "prev";
    effect?: number;
    creditAfter: number;
};

export const TransactionColumns: ColumnDef<TransactionT>[] = [
    {
        accessorKey: "date",
        header: ({ column }) => "التاريخ",
        cell: ({ row }) => {
            return (
                <div className="">
                    {row.original.date
                        ? row.original.date.toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                          })
                        : ""}
                </div>
            );
        },
    },
    {
        accessorKey: "label",
        header: ({ column }) => "العملية",
        cell: ({ row }) => {
            let label: any = row.original.label;
            switch (row.original.label) {
                case "inv":
                    label = "فاتورة مبيعات";
                    break;
                case "paymnet":
                    label = "مدفوعات";
                    break;
                case "openCredit":
                    label = "اول المدة";
                    break;
                case "prev":
                    label = "ما قبله";
                    break;
                case "returns":
                    label = "فاتورة مرتجعات";
                    break;
                default:
                    console.log("Default case");
            }
            return <div className="">{label}</div>;
        },
        size: 300,
    },

    {
        accessorKey: "transactions",
        header: ({ header }) => {
            return <div className="">الحركة</div>;
        },
        columns: [
            {
                accessorKey: "amount",
                header: ({ column }) => "مدين",
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.type === "Debit"
                                ? row.original.amount.toLocaleString("ar-EG", {
                                      useGrouping: false,
                                  })
                                : ""}
                        </div>
                    );
                },
            },
            {
                accessorKey: "amount",
                header: ({ column }) => "دائن",
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.type === "credit"
                                ? row.original.amount.toLocaleString("ar-EG", {
                                      useGrouping: false,
                                  })
                                : ""}
                        </div>
                    );
                },
            },
        ],
    },
    {
        accessorKey: "creditAfter",
        header: ({ header }) => {
            return <div className="min-w-[200px]">الرصيد الحالي</div>;
        },
        columns: [
            {
                accessorKey: "creditAfter",
                header: ({ column }) => "مدين",
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.creditAfter > 0
                                ? row.original.creditAfter.toLocaleString(
                                      "ar-EG",
                                      {
                                          useGrouping: false,
                                      }
                                  )
                                : ""}
                        </div>
                    );
                },
            },
            {
                accessorKey: "creditAfter",
                header: ({ column }) => "دائن",
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.creditAfter >= 0
                                ? ""
                                : (
                                      row.original.creditAfter * -1
                                  ).toLocaleString("ar-EG", {
                                      useGrouping: false,
                                  })}
                        </div>
                    );
                },
            },
        ],
    },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

export type productRecordsColumnsT = {
    date: Date;
    type: "out" | "in";
    recordName: string;
    quantity: number;
};

export const productRecordsColumns: ColumnDef<productRecordsColumnsT>[] = [
    {
        accessorKey: "date",
        header: ({ header }) => {
            return <div className="">التاريح</div>;
        },
        size: 700,
        cell: ({ row }) => {
            row.original.date;
        },
    },
    {
        accessorKey: "type",
        header: ({ header }) => {
            return <div className="">البيان</div>;
        },
        size: 700,
        cell: ({ row }) => {
            row.original.type;
        },
    },
    {
        accessorKey: "ActionType",
        header: ({ header }) => {
            return <div className="">الحركة</div>;
        },
        columns: [
            {
                accessorKey: "quantity",
                header: ({ header }) => {
                    return <div className="">منصرف</div>;
                },
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.type === "out"
                                ? row.original.quantity.toLocaleString(
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
                accessorKey: "quantity",
                header: ({ header }) => {
                    return <div className="">وارد</div>;
                },
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.type === "in"
                                ? row.original.quantity.toLocaleString(
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
        ],
    },
];

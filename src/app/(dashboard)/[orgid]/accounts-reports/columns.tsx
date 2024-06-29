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

export type CustomerBalanceT = {
    customerID: string;
    customerName: string;
    CustomerCredit: number;
    CustomerTotalDebit: number;
    CustomerTotalCredit: number;
    currentBalance: number;
    PageNum: number;
    ItemsPageNum: number;
    orgid: string;
};

export const CustomerBalanceColumns: ColumnDef<CustomerBalanceT>[] = [
    {
        accessorKey: "customerName",
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                        <SortableHeader column={column} label="اسم العميل" />
                    </div>
                </div>
            );
        },
        enableSorting: true,
        cell: ({ row }) => {
            return <div className="">{row.original.customerName}</div>;
        },
    },
    {
        accessorKey: "CustomerCreditHeader",
        header: ({ header }) => {
            return <div className="">الرصيد الافتتاحي</div>;
        },
        columns: [
            {
                accessorKey: "CustomerCredit",
                id: "CustomerCreditDebit",
                header: ({ column }) => {
                    return (
                        <div>
                            <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                                <SortableHeader column={column} label="مدين" />
                            </div>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.CustomerCredit > 0
                                ? row.original.CustomerCredit.toLocaleString(
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
                accessorKey: "CustomerCredit",
                header: ({ column }) => {
                    return (
                        <div>
                            <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                                <SortableHeader column={column} label="دائن" />
                            </div>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.CustomerCredit < 0
                                ? (
                                      row.original.CustomerCredit * -1
                                  ).toLocaleString("ar-EG", {
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
        accessorKey: "transactions",
        header: ({ header }) => {
            return <div className="">الحركة</div>;
        },
        columns: [
            {
                accessorKey: "CustomerTotalDebit",
                header: ({ column }) => {
                    return (
                        <div>
                            <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                                <SortableHeader column={column} label="مدين" />
                            </div>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.CustomerTotalDebit > 0
                                ? row.original.CustomerTotalDebit.toLocaleString(
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
                accessorKey: "CustomerTotalCredit",
                header: ({ column }) => {
                    return (
                        <div>
                            <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                                <SortableHeader column={column} label="دائن" />
                            </div>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.CustomerTotalCredit > 0
                                ? row.original.CustomerTotalCredit.toLocaleString(
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
    {
        accessorKey: "currentBalance",
        header: ({ header }) => {
            return <div className="min-w-[200px]">الرصيد الحالي</div>;
        },
        columns: [
            {
                accessorKey: "currentBalance",
                header: ({ column }) => {
                    return (
                        <div>
                            <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                                <SortableHeader column={column} label="مدين" />
                            </div>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.currentBalance > 0
                                ? row.original.currentBalance.toLocaleString(
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
                accessorKey: "currentBalance",
                header: ({ column }) => {
                    return (
                        <div>
                            <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                                <SortableHeader column={column} label="دائن" />
                            </div>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className="">
                            {row.original.currentBalance >= 0
                                ? ""
                                : (
                                      row.original.currentBalance * -1
                                  ).toLocaleString("ar-EG", {
                                      useGrouping: false,
                                  })}
                        </div>
                    );
                },
            },
        ],
    },
    {
        accessorKey: "actions",
        header: ({ header }) => {
            return (
                <div className="whitespace-nowrap min-w-[120px]">كشف حساب</div>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="">
                    {Actions({
                        id: row.original.customerID,
                        ItemsPageNum: row.original.ItemsPageNum,
                        PageNum: row.original.PageNum,
                        orgid: row.original.orgid,
                    })}
                </div>
            );
        },
    },
];

const Actions = ({
    id,
    PageNum,
    ItemsPageNum,
    orgid,
}: {
    id: string;
    PageNum: number;
    ItemsPageNum: number;
    orgid: string;
}) => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    return (
        <DropdownMenu
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            modal={false}
            dir="rtl"
        >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 ">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col">
                <DropdownMenuItem>
                    <Link
                        href={`/${orgid}/accounts-reports/account-statement/${id}`}
                        className="bg-orange-400 hover:bg-orange-400/80 p-2 rounded-md basis-[100%] text-center"
                    >
                        كشف حساب
                    </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                    <Link
                        href={`/${orgid}/accounts-reports/customer-credit-with-items/?customerid=${id}&Debit=true&Credit=true&page=${
                            ItemsPageNum < 1 ? 1 : ItemsPageNum
                        }`}
                        className="bg-orange-400 hover:bg-orange-400/80 p-2 rounded-md basis-[100%] text-center"
                    >
                        كشف حساب بالاصناف
                    </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <DeleteCustomerBtn id={id} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

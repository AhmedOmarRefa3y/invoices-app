"use client";

import { Button } from "@/components/ui/button";
import DeleteInvoiceBtn from "@/components/ui/deleteInvoiceBtn";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditInvoiceBtn from "@/components/ui/editInvoiceBtn";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Link from "next/link";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@nextui-org/react";
import { useState } from "react";
import InvoiceModal from "@/components/Invoice";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Invoice = {
    id: string;
    customerName: string;
    customerId: string;
    date: Date;
    number: number;
    paidAmount: number | undefined;
    createdAt: Date;
    products: {
        id: string;
        name: string;
        quantity: number;
        price: number;
    }[];
};

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
                    {row.original.customerName}
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
            row.original.products.forEach((item) => {
                amount += item.price * item.quantity;
            });

            // Define a state to manage hover visibility
            const [isHovered, setIsHovered] = useState(false);

            return (
                <div className="text-center relative">
                    {/* Apply hover effect to the amount */}
                    <div
                        className="group relative cursor-pointer"
                        onClick={() => setIsHovered(!isHovered)}
                        // onMouse={() => setIsHovered(!isHovered)}
                    >
                        {amount.toLocaleString("ar-EG", {
                            useGrouping: false,
                        })}
                    </div>

                    {/* Conditionally render the table based on hover state */}
                    {isHovered && (
                        <div className="absolute z-[100]">
                            <Table
                                aria-label="Example static collection table"
                                className=" w-[500px]"
                            >
                                <TableHeader className="">
                                    <TableColumn className="text-center rounded-none">
                                        البيان
                                    </TableColumn>
                                    <TableColumn className="text-center rounded-none">
                                        السعر
                                    </TableColumn>
                                    <TableColumn className="text-center rounded-none">
                                        القيمة
                                    </TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {row.original.products.map((item) => {
                                        return (
                                            <TableRow key="1">
                                                <TableCell>
                                                    {item.name}
                                                </TableCell>
                                                <TableCell>
                                                    {item.price}
                                                </TableCell>
                                                <TableCell>
                                                    {item.price * item.quantity}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "paidAmount",
        header: () => <div className="text-center">المدفوع</div>,

        cell: ({ row }) => {
            console.log(row.original.paidAmount);

            return (
                <div className="text-center font-medium">
                    {row.original.paidAmount
                        ? row.original.paidAmount.toLocaleString("ar-EG", {
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
                    <DropdownMenuContent>
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <Button
                                        variant={"default"}
                                        // className={cn("", className)}
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
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <EditInvoiceBtn Invoice={row.original} />
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <DeleteInvoiceBtn id={row.original.id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

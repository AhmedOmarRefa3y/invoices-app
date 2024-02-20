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
import { useIsClient } from "@uidotdev/usehooks";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";
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
    invoices: {
        id: string;
        number: number;
        customerName: string;
        Items: OrderItem[];
        date: Date;
        PaidAmount: number;
        CreatedAt: Date;
        customer: customer;
        amount: number;
    }[];
}

const InvoicesTable: React.FC<invoiceTableT> = ({ invoices }) => {
    const IsClient = useIsClient();
    if (!IsClient) return null;
    return (
        <div className=" overflow-hidden mt-3 ">
            <table className="rounded-lg w-full  overflow-hidden">
                <thead className=" rounded-md bg-[#64748b] text-center py-2 text-white">
                    <th className="w-[10%] py-2">رقم الفاتورة</th>
                    <th className="w-[10%]">تاريخ الفاتورة</th>
                    <th className="w-[20%]">اسم العميل</th>
                    <th className="w-[10%]">قيمة الفاتورة</th>
                    <th className="w-[10%]">المدفوع</th>
                    <th className="w-[10%]">المزيد</th>
                </thead>
                <tbody className="text-center bg-white">
                    {invoices.map((item, i) => {
                        return (
                            <tr
                                key={i}
                                className="odd:bg-white even:bg-slate-200 hover:text-sky-500 duration-150 text-lg font-bold "
                            >
                                <td>{item.number}</td>
                                <td>
                                    {item.date.toLocaleDateString("ar-EG", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                                <td>{item.customerName}</td>
                                <td>
                                    {item.amount.toLocaleString("ar-EG", {
                                        useGrouping: false,
                                    })}
                                </td>
                                <td>
                                    {item.PaidAmount
                                        ? item.PaidAmount.toLocaleString(
                                              "ar-EG",
                                              {
                                                  useGrouping: false,
                                              }
                                          )
                                        : ""}
                                </td>
                                <td>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 "
                                            >
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="flex flex-col">
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <Link
                                                    href={`/invoices/sales/showInvoice?num=${item.number}`}
                                                    className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
                                                >
                                                    عرض الفاتورة
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <Link
                                                    className="flex-1  text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
                                                    href={`/invoices/sales/releaseorder?num=${item.number}`}
                                                >
                                                    اذن الصرف
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="flex-1 "
                                            >
                                                <EditInvoiceBtn
                                                    Invoice={item}
                                                />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="flex-1"
                                            >
                                                <DeleteInvoiceBtn
                                                    id={item.id}
                                                    url="deleteinvoice"
                                                />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default InvoicesTable;

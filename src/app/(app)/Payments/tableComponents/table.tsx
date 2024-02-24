"use client";
import React from "react";
import DeletePaymentBtn from "@/components/ui/DeletePaymentBtn";
import EditIPayemntBtn from "@/components/ui/EditIPayemntBtn";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useIsClient } from "@uidotdev/usehooks";
interface PaymentProps {
    payamnts: {
        customerID: string;
        id: string;
        number: number;
        customerName: string;
        date: Date;
        amount: number;
        method: string;
        notes: string;
    }[];
}
const PayemntsTable: React.FC<PaymentProps> = ({ payamnts }) => {
    const IsClient = useIsClient();
    if (!IsClient) return null;
    return (
        <div className=" overflow-hidden mt-3 ">
            <table className="rounded-lg w-full  overflow-hidden">
                <thead className=" rounded-md bg-[#64748b] text-center py-2 text-white">
                    <th className="w-[10%] py-2">رقم الاشعار</th>
                    <th className="w-[10%]">تاريخ الاشعار</th>
                    <th className="w-[20%]">اسم العميل</th>
                    <th className="w-[10%]">قيمة الاشعار</th>
                    <th className="w-[10%]">طريقة السداد</th>
                    <th className="w-[20%]">ملاحظات</th>
                    <th className="w-[10%]">المزيد</th>
                </thead>
                <tbody className="text-center bg-white">
                    {payamnts.map((item, i) => {
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
                                <td>{item.method}</td>
                                <td className="text-base">{item.notes}</td>
                                <td>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="flex flex-col items-center justify-center">
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="flex-1"
                                            >
                                                <DeletePaymentBtn
                                                    id={`${item.id}`}
                                                />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="flex-1"
                                            >
                                                <EditIPayemntBtn
                                                    paymentInfo={item}
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

export default PayemntsTable;

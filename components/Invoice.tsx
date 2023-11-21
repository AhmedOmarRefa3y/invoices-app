import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
interface InvoicePageProps {
    invoice: {
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
    className?: string;
}

const InvoiceModal: React.FC<InvoicePageProps> = ({ invoice, className }) => {
    console.log(invoice);

    let totalAmount = 0;
    if (invoice) {
        invoice.products.map((item) => {
            totalAmount += item.quantity * item.price;
        });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"default"} className={cn("", className)}>
                    عرض الفاتورة
                </Button>
            </DialogTrigger>
            <DialogContent className=" max-w-screen-lg h-4/5 bg-opacity-0">
                <div className="w-full  bg-slate-300 rounded-lg font-semibold p-10 mx-auto ">
                    <div className="mb-4 border-b-2 border-black pb-5">
                        رقم الفاتورة :
                        <span className="ml-5">{invoice?.number}</span>
                    </div>
                    <div className="flex gap-10 mb-4 border-b-2 border-black pb-5">
                        <div>
                            <label>اسم العميل :</label>
                            <div className="w-fit  rounded-md ">
                                {invoice.customerName}
                            </div>
                        </div>
                        <div>
                            <label>تاريخ الفاتورة :</label>
                            <div className="w-fit  rounded-md ">
                                {invoice ? invoice.date.toDateString() : ""}
                            </div>
                        </div>
                    </div>
                    {/* items */}
                    <div className="overflow-x-auto mt-4">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr className="bg-slate-500">
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black"
                                    >
                                        البيان
                                    </th>
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black"
                                    >
                                        السعر
                                    </th>
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black"
                                    >
                                        الكمية
                                    </th>
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black"
                                    >
                                        القيمة
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                {invoice?.products.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <th
                                                align="center"
                                                className="text-lg text-black font-semibold border border-black"
                                            >
                                                {item.name}
                                            </th>
                                            <td
                                                align="center"
                                                className="text-lg text-black font-semibold border border-black"
                                            >
                                                {item.price}
                                            </td>
                                            <td
                                                align="center"
                                                className="text-lg text-black font-semibold border border-black"
                                            >
                                                {item.quantity}
                                            </td>
                                            <td
                                                align="center"
                                                className="text-lg text-black font-semibold border border-black"
                                            >
                                                {item.price * item.quantity}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th
                                        colSpan={3}
                                        align="center"
                                        className="text-lg text-black border border-black"
                                    >
                                        إجمالي الفاتورة
                                    </th>
                                    <td
                                        colSpan={1}
                                        align="center"
                                        className="text-lg text-black border border-black bg-orange-300"
                                    >
                                        {totalAmount}ج
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceModal;

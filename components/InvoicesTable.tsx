import Link from "next/link";
import React from "react";
import DeleteInvoiceBtn from "./ui/deleteInvoiceBtn";
import { Button } from "./ui/button";
import EditInvoiceBtn from "./ui/editInvoiceBtn";

interface InvoicesTableProps {
    inovices: {
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
    }[];
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ inovices }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table table-sm ">
                <thead>
                    <tr>
                        <th align="center" className=" text-black text-sm ">
                            رقم الفاتورة
                        </th>
                        <th align="center" className=" text-black text-sm">
                            العميل
                        </th>
                        <th align="center" className=" text-black text-sm">
                            تاريخ الفاتورة
                        </th>
                        <th align="center" className=" text-black text-sm">
                            اجمالي الفاتورة
                        </th>
                        <th align="center" className=" text-black text-sm">
                            المدفوع
                        </th>
                        <th align="center" className=" text-black text-sm">
                            عرض الفاتورة
                        </th>

                        <th align="center" className=" text-black text-sm">
                            ازالة
                        </th>
                        <th align="center" className=" text-black text-sm">
                            تعديل
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {inovices.map((Item) => {
                        let amount = 0;
                        Item.products.map((item) => {
                            amount += item.price * item.quantity;
                        });
                        return (
                            <tr className="mt-7" key={Item.id}>
                                <th
                                    align="center"
                                    className=" text-black text-base font-semibold"
                                >
                                    {Item.number.toLocaleString("ar-EG", {
                                        useGrouping: false,
                                    })}
                                </th>
                                <td
                                    align="center"
                                    className=" text-black text-base font-semibold"
                                >
                                    {Item.customerName}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-base font-semibold"
                                >
                                    {Item.date.toLocaleDateString("ar-EG", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-base font-semibold"
                                >
                                    {amount.toLocaleString("ar-EG", {
                                        useGrouping: false,
                                    })}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-base font-semibold"
                                >
                                    {Item.paidAmount?.toLocaleString("ar-EG", {
                                        useGrouping: false,
                                    })}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-base font-semibold"
                                >
                                    <Link
                                        href={`invoices/${Item.id}`}
                                        className="bg-lime-300 rounded-md px-3"
                                    >
                                        عرض الفاتورة
                                    </Link>
                                </td>

                                <td
                                    align="center"
                                    className=" text-black text-base"
                                >
                                    <DeleteInvoiceBtn id={Item.id} />
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-base"
                                >
                                    <EditInvoiceBtn Invoice={Item} />
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

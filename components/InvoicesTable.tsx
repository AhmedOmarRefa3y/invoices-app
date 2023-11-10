import Link from "next/link";
import React from "react";
import DeleteInvoiceBtn from "./ui/deleteInvoiceBtn";

interface InvoicesTableProps {
    inovices: {
        id: string;
        customerName: string;
        date: Date;
        number: number;
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
            <table className="table table-md h-full">
                <thead>
                    <tr>
                        <th align="center" className=" text-black text-lg ">
                            رقم الفاتورة
                        </th>
                        <th align="center" className=" text-black text-lg">
                            العميل
                        </th>
                        <th align="center" className=" text-black text-lg">
                            تاريخ الفاتورة
                        </th>
                        <th align="center" className=" text-black text-lg">
                            اجمالي الفاتورة
                        </th>
                        <th align="center" className=" text-black text-lg">
                            عرض الفاتورة
                        </th>
                        <th align="center" className=" text-black text-lg">
                            تم الانشاء في
                        </th>
                        <th align="center" className=" text-black text-lg">
                            ازالة
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
                                    className=" text-black text-xl"
                                >
                                    {Item.number.toLocaleString("ar-EG", {
                                        useGrouping: false,
                                    })}
                                </th>
                                <td
                                    align="center"
                                    className=" text-black text-xl"
                                >
                                    {Item.customerName}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl"
                                >
                                    {Item.date.toLocaleDateString("ar-EG", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl"
                                >
                                    {amount.toLocaleString("ar-EG", {
                                        useGrouping: false,
                                    })}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl"
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
                                    className=" text-black text-xl"
                                >
                                    {Item.createdAt.toLocaleDateString(
                                        "ar-EG",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl"
                                >
                                    <DeleteInvoiceBtn id={Item.id} />
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

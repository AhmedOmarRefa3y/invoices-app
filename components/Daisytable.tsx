import { Invoice } from "@prisma/client";
import Link from "next/link";
import React from "react";

interface DaisytableProps {
    inovices: {
        id: string;
        customerName: string;
        date: Date;
        number: number;
        products: {
            id: string;
            name: string;
            quantity: number;
            price: number;
        }[];
    }[];
}
const Daisytable: React.FC<DaisytableProps> = ({ inovices }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table table-xs h-full">
                <thead>
                    <tr>
                        <th align="center">رقم الفاتورة</th>
                        <th align="center">العميل</th>
                        <th align="center">تاريخ الفاتورة</th>
                        <th align="center">اجمالي الفاتورة</th>
                        <th align="center">عرض الفاتورة</th>
                        <th align="center">تم الانشاء في</th>
                    </tr>
                </thead>
                <tbody>
                    {inovices.map((Item) => {
                        let amount = 0;
                        Item.products.map((item) => {
                            amount += item.price * item.quantity;
                        });
                        return (
                            <tr className="mt-7">
                                <th align="center" className="">
                                    {Item.number}
                                </th>
                                <td align="center">{Item.customerName}</td>
                                <td align="center">
                                    {Item.date.toDateString()}
                                </td>
                                <td align="center">{amount}</td>
                                <td align="center">
                                    <Link
                                        href={`invoices/${Item.id}`}
                                        className="bg-lime-300 rounded-md px-3"
                                    >
                                        عرض الفاتورة
                                    </Link>
                                </td>
                                <td align="center">
                                    {Item.date.toLocaleDateString()}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Daisytable;

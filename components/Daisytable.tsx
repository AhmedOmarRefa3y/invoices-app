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
            <table className="table table-lg h-full">
                <thead>
                    <tr>
                        <th align="center" className=" text-black text-lg">
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
                                    {Item.number}
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
                                    {Item.date.toLocaleDateString()}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl"
                                >
                                    {amount}
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

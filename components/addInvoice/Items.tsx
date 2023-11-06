"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useInvoice from "@/lib/zustand";
import { useEffect, useState } from "react";

const ItemsContainer = () => {
    const [mounted, setmounted] = useState(false);
    const { items, DelteItem } = useInvoice();
    const DeletItemHandler = (id: string) => {
        DelteItem(id);
    };
    useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    let totalAmount = 0;
    items.map((item) => {
        totalAmount += item.quantity * item.price;
        console.log(totalAmount);
    });
    return (
        <div className=" mt-4">
            <table className="table">
                {/* head */}
                <thead>
                    {items.length < 1 ? null : (
                        <tr className="bg-slate-500">
                            <th
                                align="center"
                                className="text-lg text-black border border-black w-4/12"
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
                            <th
                                align="center"
                                className="text-lg text-black border border-black"
                            ></th>
                        </tr>
                    )}
                </thead>
                <tbody>
                    {/* row 1 */}
                    {items.map((item) => {
                        return (
                            <tr>
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
                                <td
                                    align="center"
                                    className="text-lg text-black border border-black"
                                >
                                    <button
                                        className="h-full p-2 px-5 flex items-center justify-center bg-red-600 rounded-md text-white "
                                        onClick={() =>
                                            DeletItemHandler(item.id)
                                        }
                                    >
                                        ازالة
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    {items.length < 1 ? (
                        <tr>
                            <th
                                colSpan={5}
                                align="center"
                                className="text-lg bg-gray-600  text-white border border-black"
                            >
                                لم تقم بإضافة اي صنف للفاتورة
                            </th>
                        </tr>
                    ) : (
                        <>
                            {" "}
                            <tr>
                                <th
                                    colSpan={3}
                                    align="center"
                                    className="text-lg text-black border border-black"
                                >
                                    إجمالي الفاتورة
                                </th>
                                <td
                                    colSpan={2}
                                    align="center"
                                    className="text-lg text-black border border-black bg-orange-300"
                                >
                                    {totalAmount}ج
                                </td>
                            </tr>
                        </>
                    )}
                </tfoot>
            </table>
        </div>
    );
};

export default ItemsContainer;

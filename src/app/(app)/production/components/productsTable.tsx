"use client";
import { TheadColor } from "@/colors";
import { useIsClient } from "@uidotdev/usehooks";
import { Delete } from "lucide-react";
import { useEffect, useState } from "react";

const ItemsTable = ({
    items,
    updateItem,
    deleteItem,
    type,
}: {
    updateItem: ({
        Quantity,
        id,
        name,
        avaliableQuanttiy,
    }: {
        id: string;
        name: string;
        Quantity: number;
        avaliableQuanttiy: number;
        unit: string;
    }) => void;
    deleteItem: (id: string) => void;
    type: "raw" | "product";
    items: {
        id: string;
        name: string;
        unit: string;
        Quantity: number;
        avaliableQuanttiy: number;
    }[];
}) => {
    const isClient = useIsClient();
    if (!isClient) return null;

    return (
        <>
            <span className="text-lg font-bold text-white">
                {type === "product" ? "الاصناف المنتجة:" : "الاصناف المنصرفة:"}
            </span>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg    ">
                <table className="w-full bg-white">
                    <thead className={`bg-[#64748b] text-white`}>
                        <th className="px-2 w-[5%]">م</th>
                        <th className="w-[55%] ">الصنف</th>
                        <th className="w-[10%] ">الوحدة</th>
                        <th className="w-[10%] whitespace-nowrap">
                            الكمية المنتجة
                        </th>
                        <th className="w-[15%] ">الكمية بعد الانتاج</th>
                        <th className="w-[10%] px-2">ازالة</th>
                    </thead>
                    <tbody>
                        {items.length < 1 && (
                            <tr
                                // key={i}
                                className={`"bg-gray-200"`}
                            >
                                <th className=""></th>
                                <td className="w-[55%] px-2 bg font-bold text-base"></td>
                                <td className="w-[10%] text-center font-bold"></td>
                                <td className="w-[10%] text-center font-bold">
                                    <input
                                        className="w-full bg-transparent text-center"
                                        type="number"
                                        disabled
                                        min={0}
                                    />
                                </td>
                                <td className="w-[20%] text-center font-bold"></td>
                                <td className="w-[10%] text-center  text-red-500 hover:text-red-700"></td>
                            </tr>
                        )}
                        {items.map((item, i) => (
                            <tr
                                key={i}
                                className={`${
                                    items.indexOf(item) % 2 === 0
                                        ? "bg-gray-100"
                                        : "bg-gray-200"
                                }`}
                            >
                                <th className="">{items.indexOf(item) + 1}</th>
                                <td className="w-[55%] px-2 bg font-bold text-base">
                                    {item.name}
                                </td>
                                <td className="w-[10%] text-center font-bold">
                                    {item.unit}
                                </td>
                                <td className="w-[10%] text-center font-bold">
                                    <input
                                        className="w-full bg-transparent text-center"
                                        type="number"
                                        value={item.Quantity}
                                        min={0}
                                        onChange={(e) => {
                                            if (e.target.valueAsNumber > 10000)
                                                return;
                                            updateItem({
                                                ...item,
                                                Quantity:
                                                    e.target.valueAsNumber,
                                            });
                                        }}
                                    />
                                </td>
                                <td className="w-[20%] text-center font-bold">
                                    {type === "raw"
                                        ? item.avaliableQuanttiy -
                                          (item.Quantity | 0)
                                        : item.avaliableQuanttiy +
                                          (item.Quantity | 0)}
                                </td>
                                <td className="w-[10%] text-center  text-red-500 hover:text-red-700">
                                    <Delete
                                        className="mx-auto"
                                        onClick={() => {
                                            deleteItem(item.id);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ItemsTable;

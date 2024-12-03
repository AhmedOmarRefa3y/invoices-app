"use client";
import { useIsClient } from "@uidotdev/usehooks";
import { Delete } from "lucide-react";

const ItemsTable = ({
    items,
    updateItem,
    deleteItem,
    type,
    th5,
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
    type:
        | "raw"
        | "product"
        | "plan"
        | "planProducts"
        | "partsProducts"
        | "initialQuantities";
    items: {
        id: string;
        name: string;
        unit: string;
        Quantity: number;
        avaliableQuanttiy?: number;
    }[];
    th5?: string;
}) => {
    return (
        <div className="relative overflow-x-auto text-base">
            <table className="w-full bg-white border border-stone-300 ">
                <thead className={`bg-[#fafafa]`}>
                    <tr>
                        <th className="px-2 w-[5%] border border-stone-300">
                            #
                        </th>
                        <th className="w-[60%] px-2 border border-stone-300">
                            Item
                        </th>
                        <th className="w-[10%] px-2 border border-stone-300">
                            Unit
                        </th>
                        <th className="w-[10%] px-2  border border-stone-300">
                            Quantity
                        </th>
                        <th className="w-[10%] px-2 border border-stone-300">
                            Remove
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.length < 1 && (
                        <tr className={`"bg-gray-200"`}>
                            <th className="border border-stone-300 p-4"></th>
                            <td className="w-[55%] px-2 bg font-bold text-base border border-stone-300"></td>
                            <td className="w-[10%] text-center font-bold border border-stone-300"></td>
                            <td className="w-[10%] text-center font-bold border border-stone-300"></td>

                            <td className="w-[10%] text-center  text-red-500 hover:text-red-700 border border-stone-300"></td>
                        </tr>
                    )}
                    {items.map((item, i) => (
                        <tr key={i}>
                            <th className="border border-stone-300">
                                {items.indexOf(item) + 1}
                            </th>
                            <td className="w-[55%] px-2 bg font-bold text-base border border-stone-300">
                                {item.name}
                            </td>
                            <td className="w-[10%] text-center font-bold border border-stone-300">
                                {item.unit}
                            </td>
                            <td className="w-[10%] text-center font-bold border border-stone-300">
                                {item.Quantity}
                            </td>

                            <td className="w-[10%] text-center  text-red-500 hover:text-red-700 border border-stone-300">
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
    );
};

export default ItemsTable;

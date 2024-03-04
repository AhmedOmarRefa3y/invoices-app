"use client";
import { useIsClient } from "@uidotdev/usehooks";
import { Delete } from "lucide-react";

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
        avaliableQuanttiy?: number;
        unit: string;
    }) => void;
    deleteItem: (id: string) => void;
    type: "raw" | "product";
    items: {
        id: string;
        name: string;
        unit: string;
        Quantity: number;
        avaliableQuanttiy?: number;
    }[];
}) => {
    const isClient = useIsClient();
    if (!isClient) return null;

    return (
        <>
            <div className="relative overflow-x-auto text-base">
                <table className="w-full bg-white border border-stone-300 ">
                    <thead className={`bg-[#fafafa]`}>
                        <th className="px-2 w-[5%] border border-stone-300">
                            م
                        </th>
                        <th className="w-[60%] px-2 border border-stone-300">
                            الصـــــــــــــــــنف
                        </th>
                        <th className="w-[10%] px-2 border border-stone-300">
                            الوحدة
                        </th>
                        <th className="w-[10%] px-2  border border-stone-300">
                            الكمية
                        </th>
                        <th className="w-[10%] px-2 border border-stone-300">
                            الكمية بعد الانتاج
                        </th>
                        <th className="w-[10%] px-2 border border-stone-300">
                            ازالة
                        </th>
                    </thead>
                    <tbody>
                        {items.length < 1 && (
                            <tr
                                // key={i}
                                className={`"bg-gray-200"`}
                            >
                                <th className="border border-stone-300"></th>
                                <td className="w-[55%] px-2 bg font-bold text-base border border-stone-300"></td>
                                <td className="w-[10%] text-center font-bold border border-stone-300"></td>
                                <td className="w-[10%] text-center font-bold border border-stone-300">
                                    <input
                                        className="w-full bg-transparent text-center"
                                        type="number"
                                        disabled
                                        min={0}
                                    />
                                </td>
                                <td className="w-[20%] text-center font-bold border border-stone-300"></td>
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
                                <td className="w-[20%] text-center font-bold border border-stone-300">
                                    {type === "raw" && item.avaliableQuanttiy
                                        ? item.avaliableQuanttiy -
                                          (item.Quantity | 0)
                                        : item.avaliableQuanttiy
                                        ? item.avaliableQuanttiy +
                                          (item.Quantity | 0)
                                        : null}
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
        </>
    );
};

export default ItemsTable;

"use client";
import useProdcutionStore from "@/lib/productionStore";
import { useIsClient } from "@uidotdev/usehooks";
import { Delete } from "lucide-react";
import React from "react";

const RawMaterials = () => {
    const ProductionStore = useProdcutionStore();
    const {
        RawMaterials,
        AddRawMaterial,
        DeleteRawMaterial,
        updateRawMaterial,
    } = ProductionStore;
    const isClient = useIsClient();
    if (!isClient) return null;
    return (
        <>
            <span>المواد الخام المنصرفة</span>
            <div className="w-full">
                <table className="w-full ">
                    <thead className="border border-black ">
                        <th className="w-[70%]">الصنف</th>
                        <th>الكمية المنتجة</th>
                        <th> الكمية بعد الانتاج</th>
                        <th>ازالة</th>
                    </thead>
                    <tbody>
                        {RawMaterials.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.Quantity}
                                        onChange={(e) => {
                                            updateRawMaterial({
                                                ...item,
                                                Quantity: parseFloat(
                                                    e.target.value
                                                ),
                                            });
                                        }}
                                    />
                                </td>
                                <td>
                                    {item.avaliableQuanttiy - item.Quantity}
                                </td>
                                <td>
                                    <Delete
                                        onClick={() => {
                                            console.log("das");

                                            DeleteRawMaterial(item.id);
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

export default RawMaterials;

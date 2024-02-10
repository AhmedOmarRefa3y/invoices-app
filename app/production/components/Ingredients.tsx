"use client";
import useProdcutionStore from "@/lib/productionStore";
import { useIsClient } from "@uidotdev/usehooks";
import React from "react";

const Ingredients = () => {
    const ProductionStore = useProdcutionStore();
    const { AddMainProduct, MainProducts } = ProductionStore;
    const isClient = useIsClient();
    if (!isClient) return null;
    return (
        <>
            <span>المكونات</span>
            <div className="w-full">
                <table className="w-full ">
                    <thead className="border border-black ">
                        <th className="w-[70%]">الصنف</th>
                        <th>الكمية المنتجة</th>
                        <th>الكمية المتاحة</th>
                    </thead>
                    <tbody>
                        {MainProducts.map((item) => (
                            <tr key={item.productId}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Ingredients;

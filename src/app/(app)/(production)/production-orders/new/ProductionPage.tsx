"use client";
import React, { useState } from "react";
import useProdcutionStore from "@/lib/productionStore";
import { Part, Prisma } from "@prisma/client";
import SelectItem from "../components/SelectProduct";
import ItemsTable from "../components/productsTable";
import { Button } from "@/components/ui/button";
import { SaveProduction } from "./ProductionPageUtils";
import {
    Select,
    SelectContent,
    SelectItem as SelectcoM,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";

type ProductionPlan = Prisma.ProductionPlanGetPayload<{
    include: {
        lineItems: {
            include: {
                product: true;
            };
        };
    };
}>;
export interface ProductionPageT {
    products: {
        id: string;
        name: string;
        isAComposistion: boolean | undefined;
        avaliableQuantity: number;
        unit: string;
        parts?: Part[];
    }[];

    productionPlans: ProductionPlan[];
}

const ProductionPage: React.FC<ProductionPageT> = ({
    products,
    productionPlans,
}) => {
    const [id, setid] = useState<string | undefined>(undefined);
    const store = useProdcutionStore();
    const {
        MainProducts,
        AddMainProduct,
        DeleteProduct,
        updateProduct,
        RawMaterials,
        AddRawMaterial,
        DeleteRawMaterial,
        updateRawMaterial,
        clearData,
    } = store;

    return (
        <div className="relative flex  w-full h-screen gap-4 p-4   rounded-md max-w-6xl mx-auto">
            <div className="basis-[30%]">
                <div>
                    <div>خطة انتاج</div>
                    <Select
                        onValueChange={(value) => {
                            console.log(value);

                            setid(value);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                            {productionPlans.map((production) => {
                                return (
                                    <SelectcoM
                                        key={production.id}
                                        value={production.id}
                                        onSelect={() => {
                                            setid(production.id);
                                            console.log(production.id);
                                        }}
                                    >
                                        {production.number}
                                    </SelectcoM>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    <table className="w-full bg-white border border-stone-300">
                        <thead className={`bg-[#fafafa]`}>
                            <tr>
                                <th className="px-2 w-[5%] border border-stone-300">
                                    م
                                </th>
                                <th className="w-[55%] border border-stone-300">
                                    الصنف
                                </th>
                                <th className="w-[10%] whitespace-nowrap border border-stone-300">
                                    الكمية
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {productionPlans
                                .find((item) => item.id === id)
                                ?.lineItems.map((item, i) => (
                                    <tr key={i}>
                                        <td className="border border-stone-300 text-center">
                                            {i + 1}
                                        </td>
                                        <td className="w-[55%] px-2 bg font-bold text-base border border-stone-300">
                                            {item.product.name}
                                        </td>

                                        <td className="w-[10%] text-center font-bold border border-stone-300">
                                            {item.quantity}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="basis-[70%]">
                <Button
                    className="absolute left-3 bg-sky-500 hover:bg-sky-400 text-black font-bold text-lg"
                    onClick={async () => {
                        const { status, data, message } = await SaveProduction({
                            MainProducts,
                            RawMaterials,
                            productionPlanID: id as string,
                        });
                        if (status === "ok") {
                            clearData();
                        }
                    }}
                >
                    حفظ امر الانتاج
                </Button>
                <div>
                    <div className="flex items-center gap-2 p-2 h-fit">
                        <SelectItem
                            type="product"
                            addItem={AddMainProduct}
                            products={products}
                        />
                    </div>
                    <ItemsTable
                        type="product"
                        items={MainProducts}
                        deleteItem={DeleteProduct}
                        updateItem={updateProduct}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 p-2 h-fit">
                        <SelectItem
                            type="raw"
                            addItem={AddRawMaterial}
                            products={products}
                        />
                    </div>
                    <ItemsTable
                        type="raw"
                        items={RawMaterials}
                        deleteItem={DeleteRawMaterial}
                        updateItem={updateRawMaterial}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductionPage;

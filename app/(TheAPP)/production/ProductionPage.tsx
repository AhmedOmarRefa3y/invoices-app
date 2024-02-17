"use client";
import React from "react";
import useProdcutionStore from "@/lib/productionStore";
import { Part } from "@prisma/client";
import SelectItem from "./components/SelectProduct";
import ItemsTable from "./components/productsTable";
import { Button } from "@/components/ui/button";
import { SaveProduction } from "./ProductionPageUtils";

export interface ProductionPageT {
    products: {
        id: string;
        name: string;
        isAComposistion: boolean | undefined;
        avaliableQuantity: number;
        unit: string;
        parts?: Part[];
    }[];
}

const ProductionPage: React.FC<ProductionPageT> = ({ products }) => {
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
        <div className="relative flex flex-col w-full h-screen gap-4 p-4  border border-black rounded-md">
            <Button
                className="absolute left-3"
                onClick={async () => {
                    const { status, data, message } = await SaveProduction({
                        MainProducts,
                        RawMaterials,
                    });
                    if (status === "ok") {
                        clearData();
                    }
                    console.log(data);
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
    );
};

export default ProductionPage;

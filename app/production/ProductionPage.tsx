"use client";
import SelectProduct from "@/app/production/components/SelectProduct";
import React from "react";
import Ingredients from "./components/Ingredients";
import RawMaterials from "./components/RawMaterial";
import SelectRawMaterial from "./components/selectRawMaterial";
import ItemsTable from "./components/productsTable";
import useProdcutionStore from "@/lib/productionStore";
import SelectItem from "./components/SelectProduct";
import { Part } from "@prisma/client";

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
    } = store;
    return (
        <div className="flex flex-col w-full h-screen gap-4 p-4  border border-black rounded-md">
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

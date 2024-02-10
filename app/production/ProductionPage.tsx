import SelectProduct from "@/app/production/components/SelectProduct";
import React from "react";
import Ingredients from "./components/Ingredients";
import { ProductionProduct } from "@/lib/productionStore";
import SelectRawMaterial from "./components/selectRawMaterial";
import RawMaterials from "./components/RawMaterial";

export interface ProductionPageT {
    products: {
        id: string;
        name: string;
        isAComposistion: boolean | undefined;
        avaliableQuantity: number;
        unit: string;
    }[];
}
const ProductionPage: React.FC<ProductionPageT> = ({ products }) => {
    return (
        <div className="flex flex-col w-full h-screen gap-4 p-4  border border-black rounded-md">
            <div>
                <div className="flex items-center gap-2 p-2 h-fit">
                    <SelectProduct products={products} />
                </div>
                <Ingredients />
            </div>
            <div>
                <div className="flex items-center gap-2 p-2 h-fit">
                    <SelectRawMaterial products={products} />
                </div>
                <RawMaterials />
            </div>
        </div>
    );
};

export default ProductionPage;

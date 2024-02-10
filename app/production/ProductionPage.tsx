import SelectProduct from "@/app/production/components/SelectProduct";
import React from "react";
import Ingredients from "./components/Ingredients";
import { ProductionProduct } from "@/lib/productionStore";

export interface ProductionPageT {
    products: ProductionProduct[];
}
const ProductionPage: React.FC<ProductionPageT> = ({ products }) => {
    return (
        <div className="flex flex-col w-full h-screen gap-4 p-4  border border-black rounded-md">
            <div className="flex items-center gap-2 p-2 h-fit">
                <SelectProduct products={products} />
            </div>
            <Ingredients />
        </div>
    );
};

export default ProductionPage;

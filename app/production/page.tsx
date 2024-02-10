import React from "react";

import prismaDb from "@/lib/prisma";
import ProductionPage,  from "./ProductionPage";

import { getAvailableProducts } from "../inventory/inventory-utils";
import { ProductionProduct } from "@/lib/productionStore";


const Page = async () => {
    const Products = await prismaDb.product.findMany({
        orderBy: {
            name: "asc",
        },
        where: {
            isAcomopsition: false,
        },
        include: {
            Part: true,
        },
    });
    const InventoryItems = await getAvailableProducts();
    const formattedProducts: Partial<ProductionProduct>[] = InventoryItems.map(
        (item) => {
            return {
               avaliableQuanttiy: item.availableQuantity,
               id: item.id,
               name: item.productName,
            };
        }
    );

    return <ProductionPage products={formattedProducts} />;
};

export default Page;

import React from "react";

import prismaDb from "@/lib/prisma";
import ProductionPage, { ProductionPageT } from "./ProductionPage";
import { ProductionProduct } from "@/lib/types";

const Page = async () => {
    const Products = await prismaDb.product.findMany({
        include: {
            Part: true,
        },
    });
    const formattedProducts: ProductionProduct[] = Products.map((Product) => {
        return {
            productId: Product.id,
            name: Product.name,
            isAcomposistion: Product.isAcomopsition,
            parts:
                Product.Part && Product.Part.length > 0
                    ? Product.Part
                    : undefined,
        };
    });
    return <ProductionPage products={formattedProducts} />;
};

export default Page;

import ProductionPage from "./ProductionPage";

import { getAvailableProducts } from "../../inventory/inventory-utils";
import { Part } from "@prisma/client";

const Page = async () => {
    const InventoryItems = await getAvailableProducts();
    const formattedProducts: {
        id: string;
        name: string;
        isAComposistion: boolean | undefined;
        avaliableQuantity: number;
        unit: string;
        parts?: Part[];
    }[] = InventoryItems.map((item) => {
        return {
            avaliableQuantity: item.availableQuantity,
            id: item.id,
            name: item.productName,
            isAComposistion: item.isAcomposistion,
            unit: item.unit,
            parts: item.parts,
        };
    });

    return <ProductionPage products={formattedProducts} />;
};

export default Page;

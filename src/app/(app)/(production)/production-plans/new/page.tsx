import { getAvailableProducts } from "@/(app)/inventory/inventory-utils";
import { Part } from "@prisma/client";
import ProductionPlanTable from "./components.tsx/ProductionPlanTable";

const page = async () => {
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
    return (
        <div className="h-screen w-full flex flex-col items-center  p-3">
            <div className="text-lg ">خطة انتاج جديدة</div>
            <ProductionPlanTable products={formattedProducts} />
        </div>
    );
};

export default page;

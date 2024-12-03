import { PartT } from "@/lib/types";
import { getAvailableProducts } from "../../../inventory/inventory-utils";
import ProductionPlanTable from "./components/ProductionPlanTable";

const page = async ({ params }: { params: { orgid: string } }) => {
    const InventoryItems = await getAvailableProducts(params.orgid);
    const formattedProducts: {
        id: string;
        name: string;
        isAComposistion: boolean | undefined;
        avaliableQuantity: number;
        unit: string;
        parts?: PartT[];
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
        <div className=" w-full flex flex-col items-center  p-3">
            <div className="text-lg font-bold">New Production Plan</div>
            <ProductionPlanTable products={formattedProducts} />
        </div>
    );
};

export default page;

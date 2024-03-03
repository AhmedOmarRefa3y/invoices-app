"use client";

import { Part } from "@prisma/client";
import useProdcutionStore from "@/lib/productionStore";

import { Button } from "@/components/ui/button";
import { CreateProductionPLan } from "@/actions/production";
import toast from "react-hot-toast";
import SelectItem from "@/(app)/(production)/components/SelectProduct";
import ItemsTable from "@/(app)/(production)/components/productsTable";

interface ProductionPlanTableProps {
    products: {
        id: string;
        name: string;
        isAComposistion?: boolean;
        avaliableQuantity: number;
        unit: string;
        parts?: Part[];
    }[];
}
const ProductionPlanTable: React.FC<ProductionPlanTableProps> = ({
    products,
}) => {
    const ProductionStore = useProdcutionStore();
    return (
        <div>
            <SelectItem
                products={products}
                addItem={ProductionStore.AddProductionPlanItems}
                type="plan"
            />
            <ItemsTable
                deleteItem={ProductionStore.DeleteProductionPlanItem}
                items={ProductionStore.productionPlanItems}
                type="product"
                updateItem={ProductionStore.updateProductionPlanItems}
            />
            <Button
                onClick={async () => {
                    const formattedProducts =
                        ProductionStore.productionPlanItems.map((item) => {
                            return {
                                id: item.id,
                                quantity: item.Quantity,
                            };
                        });
                    const res = await CreateProductionPLan(formattedProducts);
                    if (res.status === "ok") {
                        toast.success("تم انشاء خطة انتاج بنجاح");
                    }
                }}
            >
                انشاء خطة
            </Button>
        </div>
    );
};

export default ProductionPlanTable;

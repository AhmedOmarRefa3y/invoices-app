"use client";

import { Part } from "@prisma/client";
import useProdcutionStore from "@/lib/productionStore";

import { Button } from "@/components/ui/button";
import { CreateProductionPLan } from "@/actions/production";
import toast from "react-hot-toast";
import SelectItem from "@/(app)/[orgid]/(production)/components/SelectProduct";
import ItemsTable from "@/(app)/[orgid]/(production)/components/productsTable";

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
        <div className="flex flex-col gap-2 items-center w-[700px]">
            <SelectItem
                products={products}
                addItem={ProductionStore.AddProductionPlanItems}
                type="plan"
            />

            <div className="w-full">
                <div>الاصناف</div>
                <ItemsTable
                    deleteItem={ProductionStore.DeleteProductionPlanProduct}
                    items={ProductionStore.productionPlanProducts}
                    type="product"
                    updateItem={ProductionStore.updateProductionPlanProduct}
                />
            </div>
            <div className="w-full">
                <div>الاجزاء</div>
                <ItemsTable
                    deleteItem={ProductionStore.DeleteProductionPlanItem}
                    items={ProductionStore.productionPlanItems}
                    type="product"
                    updateItem={ProductionStore.updateProductionPlanItems}
                />
            </div>
            <Button
                onClick={async () => {
                    const formattedProducts = {
                        ProductionPLanItems:
                            ProductionStore.productionPlanItems.map((item) => {
                                return {
                                    id: item.id,
                                    quantity: item.Quantity,
                                };
                            }),
                        ProductionPLanProducts:
                            ProductionStore.productionPlanProducts.map(
                                (item) => {
                                    return {
                                        id: item.id,
                                        quantity: item.Quantity,
                                    };
                                }
                            ),
                    };
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

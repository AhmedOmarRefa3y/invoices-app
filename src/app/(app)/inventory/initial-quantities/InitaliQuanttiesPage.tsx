"use client";

import { Part } from "@prisma/client";
import useProdcutionStore from "@/lib/productionStore";

import { Button } from "@/components/ui/button";
import { CreateProductionPLan } from "@/actions/production";
import toast from "react-hot-toast";
import SelectItem from "@/(app)/(production)/components/SelectProduct";
import ItemsTable from "@/(app)/(production)/components/productsTable";
import useInitaliQuanttiesStore from "@/lib/initialStore";

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
const InitaliQuanttiesPage: React.FC<ProductionPlanTableProps> = ({
    products,
}) => {
    const InitaliQuantties = useInitaliQuanttiesStore();
    return (
        <div className="flex flex-col gap-2 items-center w-[700px]">
            <SelectItem
                products={products}
                addItem={InitaliQuantties.AddProduct}
                type="plan"
            />

            <div className="w-full">
                <div>الاصناف</div>
                <ItemsTable
                    deleteItem={InitaliQuantties.DeleteProduct}
                    items={InitaliQuantties.InitaliQuanttiesProducts}
                    type="product"
                    updateItem={InitaliQuantties.updateProduct}
                />
            </div>

            <Button
            // onClick={async () => {
            //     const formattedProducts =
            //         ProductionStore.productionPlanItems.map((item) => {
            //             return {
            //                 id: item.id,
            //                 quantity: item.Quantity,
            //             };
            //         });
            //     const res = await CreateProductionPLan({
            //         ProductionPLanItems: formattedProducts,
            //         ProductionPLanProducts:
            //             ProductionStore.productionPlanProducts.map(
            //                 (item) => {
            //                     return {
            //                         id: item.id,
            //                         quantity: item.Quantity,
            //                     };
            //                 }
            //             ),
            //     });
            //     if (res.status === "ok") {
            //         toast.success("تم انشاء خطة انتاج بنجاح");
            //     }
            // }}
            >
                انشاء خطة
            </Button>
        </div>
    );
};

export default InitaliQuanttiesPage;

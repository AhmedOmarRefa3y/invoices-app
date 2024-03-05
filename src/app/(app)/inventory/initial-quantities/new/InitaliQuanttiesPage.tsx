"use client";

import { Part } from "@prisma/client";

import SelectItem from "@/(app)/(production)/components/SelectProduct";
import ItemsTable from "@/(app)/(production)/components/productsTable";
import {
    CreateInitailQuantitesList,
    UpdateInitailQuantitesList,
} from "@/actions/production";
import { Button } from "@/components/ui/button";
import useInitaliQuanttiesStore from "@/lib/initialStore";
import toast from "react-hot-toast";

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
                onClick={async () => {
                    const formattedProducts =
                        InitaliQuantties.InitaliQuanttiesProducts.map(
                            (item) => {
                                return {
                                    id: item.id,
                                    quantity: item.Quantity,
                                };
                            }
                        );
                    const res = InitaliQuantties.editMode
                        ? await UpdateInitailQuantitesList({
                              products: formattedProducts,
                              id: InitaliQuantties.EditID as string,
                          })
                        : await CreateInitailQuantitesList({
                              products: formattedProducts,
                          });
                    if (res.status === "ok") {
                        toast.success(`${res.message}`);
                    } else {
                        toast.error(`${res.message}`);
                    }
                }}
            >
                {InitaliQuantties.editMode ? "تعديل" : "حفظ"}
            </Button>
        </div>
    );
};

export default InitaliQuanttiesPage;

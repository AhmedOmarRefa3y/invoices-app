"use client";
import useProdcutionStore from "@/lib/zustand/productionStore";
import { Button } from "@/components/ui/button";
import { CreateProductionPLan } from "@/app/actions/production";
import toast from "react-hot-toast";

import ItemsTable from "../../../components/productsTable";
import SelectItem from "../../../components/SelectProduct";
import { useParams } from "next/navigation";
import { PartT } from "@/lib/types";
import { useEffect, useRef } from "react";

interface ProductionPlanTableProps {
    products: {
        id: string;
        name: string;
        isAComposistion?: boolean;
        avaliableQuantity: number;
        unit: string;
        parts?: PartT[];
    }[];
}
const ProductionPlanTable: React.FC<ProductionPlanTableProps> = ({
    products,
}) => {
    const ProductionStore = useProdcutionStore();
    const { AddProductionPlanItems } = ProductionStore;
    const params: { orgid: string } = useParams();

    const productionPlanProducts = useProdcutionStore(
        (state) => state.productionPlanProducts
    );

    const productionStoreRef = useRef(ProductionStore);

    useEffect(() => {
        productionStoreRef.current.clearData();
        productionPlanProducts.map((productD) => {
            const FindProduct = products?.find(
                (productDD) => productDD.id === productD.id
            );
            if (FindProduct) {
                if (FindProduct?.isAComposistion) {
                    FindProduct.parts?.map((part) => {
                        const product = products?.find(
                            (product) => product.id === part.partProductId
                        );
                        if (product) {
                            AddProductionPlanItems({
                                id: product.id,
                                avaliableQuanttiy: product.avaliableQuantity
                                    ? product.avaliableQuantity
                                    : 0,
                                name: product.name,
                                Quantity:
                                    part.quantity * (productD.Quantity || 1),
                                unit: product.unit,
                            });
                        }
                    });
                } else {
                    AddProductionPlanItems({
                        id: FindProduct?.id,
                        avaliableQuanttiy: FindProduct.avaliableQuantity
                            ? FindProduct.avaliableQuantity
                            : 0,
                        name: FindProduct.name,
                        Quantity: productD.Quantity,
                        unit: FindProduct.unit,
                    });
                }
            }
        });
    }, [productionPlanProducts, AddProductionPlanItems, products]);

    return (
        <div className="flex flex-col gap-2 items-center w-[700px]">
            <SelectItem
                products={products}
                addItem={ProductionStore.AddProductionPlanProduct}
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
                    const res = await CreateProductionPLan({
                        ...formattedProducts,
                        orgid: params.orgid,
                    });
                    if (res.status === "ok") {
                        toast.success("تم انشاء خطة انتاج بنجاح");
                        ProductionStore.clearData();
                    }
                }}
            >
                انشاء خطة
            </Button>
        </div>
    );
};

export default ProductionPlanTable;

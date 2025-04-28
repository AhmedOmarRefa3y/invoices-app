"use client";
import useProdcutionStore from "@/lib/zustand/productionStore";
import { Button } from "@/components/ui/button";
import { CreateProductionPLan } from "@/actions/production";
import toast from "react-hot-toast";

import ItemsTable from "../../../components/productsTable";
import SelectItem from "../../../components/SelectProduct";
import {} from "@/i18n/routing";
import { PartT } from "@/lib/types";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

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
const ProductionPlanTable: React.FC<ProductionPlanTableProps> = ({ products }) => {
  const ProductionStore = useProdcutionStore();
  const { AddProductionPlanItems, productionPlanProducts } = ProductionStore;
  const { orgid } = useParams();

  const productionStoreRef = useRef(ProductionStore);

  useEffect(() => {
    productionStoreRef.current.clearProductionPlanItems();
    productionPlanProducts.map((productD) => {
      const FindProduct = products?.find((productDD) => productDD.id === productD.id);
      if (FindProduct) {
        if (FindProduct?.isAComposistion) {
          FindProduct.parts?.map((part) => {
            const product = products?.find((product) => product.id === part.partProductId);
            if (product) {
              AddProductionPlanItems({
                id: product.id,
                avaliableQuanttiy: product.avaliableQuantity ? product.avaliableQuantity : 0,
                name: product.name,
                Quantity: part.quantity * (productD.Quantity || 1),
                unit: product.unit,
              });
            }
          });
        } else {
          AddProductionPlanItems({
            id: FindProduct?.id,
            avaliableQuanttiy: FindProduct.avaliableQuantity ? FindProduct.avaliableQuantity : 0,
            name: FindProduct.name,
            Quantity: productD.Quantity,
            unit: FindProduct.unit,
          });
        }
      }
    });
  }, [productionPlanProducts, AddProductionPlanItems, products]);

  return (
    <div className="flex flex-col gap-2 items-center w-[900px]">
      <SelectItem
        products={products}
        addItem={ProductionStore.AddProductionPlanProduct}
        type="plan"
      />

      <div className="w-full">
        <div>Items</div>
        <ItemsTable
          deleteItem={ProductionStore.DeleteProductionPlanProduct}
          items={ProductionStore.productionPlanProducts}
          type="planProducts"
          updateItem={ProductionStore.updateProductionPlanProduct}
        />
      </div>
      <div className="w-full">
        <div>Parts</div>
        <ItemsTable
          deleteItem={ProductionStore.DeleteProductionPlanItem}
          items={ProductionStore.productionPlanItems}
          type="product"
          updateItem={ProductionStore.updateProductionPlanItems}
        />
      </div>
      <Button
        className="w-full"
        onClick={async () => {
          const formattedProducts = {
            ProductionPLanItems: ProductionStore.productionPlanItems.map((item) => {
              return {
                id: item.id,
                quantity: item.Quantity,
              };
            }),
            ProductionPLanProducts: ProductionStore.productionPlanProducts.map((item) => {
              return {
                id: item.id,
                quantity: item.Quantity,
              };
            }),
          };
          const res = await CreateProductionPLan({
            ...formattedProducts,
            orgid: orgid as string,
          });
          if (res.status === "ok") {
            toast.success("Production plan created successfully");
            ProductionStore.clearData();
          }
        }}
      >
        Create Plan
      </Button>
    </div>
  );
};

export default ProductionPlanTable;

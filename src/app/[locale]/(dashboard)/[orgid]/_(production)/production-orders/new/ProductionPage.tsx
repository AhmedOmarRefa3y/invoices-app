"use client";
import React, { useState } from "react";
import useProdcutionStore from "@/lib/zustand/productionStore";
import { Part, Prisma } from "@prisma/client";
import SelectItem from "../../components/SelectProduct";
import ItemsTable from "../../components/productsTable";
import { Button } from "@/components/ui/button";
import { SaveProduction } from "./ProductionPageUtils";
import {
  Select,
  SelectContent,
  SelectItem as SelectcoM,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import toast from "react-hot-toast";
import {} from "@/i18n/routing";
import { useParams } from "next/navigation";

type ProductionPlan = Prisma.ProductionPlanGetPayload<{
  include: {
    lineItems: {
      include: {
        product: {
          include: {
            unit: true;
          };
        };
      };
    };
    ProductionEvents: {
      include: {
        lineItems: {
          include: {
            product: {
              include: {
                unit: true;
              };
            };
          };
        };
      };
    };
  };
}>;
export interface ProductionPageT {
  products: {
    id: string;
    name: string;
    isAComposistion: boolean | undefined;
    avaliableQuantity: number;
    unit: string;
    parts?: Part[];
  }[];

  productionPlans: ProductionPlan[];
}

const ProductionPage: React.FC<ProductionPageT> = ({ products, productionPlans }) => {
  const [id, setid] = useState<string | undefined>(undefined);
  const store = useProdcutionStore();
  const { orgid } = useParams();

  const {
    MainProducts,
    AddMainProduct,
    DeleteProduct,
    updateProduct,
    RawMaterials,
    AddRawMaterial,
    DeleteRawMaterial,
    updateRawMaterial,
    clearData,
  } = store;

  const CurrentPlan = productionPlans.find((item) => item.id === id);
  const items: {
    id: string;
    name: string;
    unit: string;
    quantity: number;
    produced: number;
  }[] = CurrentPlan
    ? CurrentPlan.lineItems.map((item) => {
        return {
          id: item.product.id,
          name: item.product.name,
          unit: item.product.unit?.name as string,
          quantity: item.quantity,
          produced: 0,
        };
      })
    : [];
  CurrentPlan?.ProductionEvents.map((ProductionEvent) => {
    ProductionEvent.lineItems?.map((itemDDD) => {
      const itemD = items?.find((itemDD) => itemDD.id === itemDDD.product.id);
      if (itemD) {
        itemD.produced += itemDDD.quantity;
      }
    });
  });

  const FilterdProductsD: {
    id: string;
    name: string;
    isAComposistion?: boolean;
    avaliableQuantity: number;
    unit: string;
    parts?: Part[];
    maxquantity: number;
  }[] = [];
  products.map((item) => {
    const isItemInPlan = items?.find((itemD) => itemD.id === item.id);
    if (isItemInPlan) {
      const isITemAdded = MainProducts.find((itemD) => itemD.id === item.id);
      if (isITemAdded) {
        return;
      }
      FilterdProductsD.push({
        ...item,
        maxquantity: isItemInPlan.quantity - isItemInPlan.produced,
      });
    }
  });
  return (
    <div className="min-w-[670px] p-3 ">
      <div className="relative">
        <div className="flex flex-col  ">
          <div className="flex gap-2 items-end justify-between  mb-3">
            <div>
              <div className="text-lg font-bold whitespace-nowrap">Production Plan Number:</div>
              <Select
                onValueChange={(value) => {
                  setid(id === value ? undefined : value);
                  clearData();
                }}
              >
                <SelectTrigger className="lg:w-[200px]  text-center justify-center flex items-center  rounded-none border border-stone-300 font-bold py-1 lg:text-lg  focus:ring-offset-0 select-none">
                  <SelectValue
                    placeholder="Select a production plan"
                    className="font-bold  text-center"
                  >
                    {productionPlans.find((item) => item.id === id)?.number
                      ? productionPlans.find((item) => item.id === id)?.number
                      : "Select a production plan"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className=" text-black w-[200px] rounded-none ">
                  {productionPlans.map((production) => {
                    return (
                      <SelectcoM
                        key={production.id}
                        value={production.id}
                        onSelect={() => {
                          setid(production.id);
                        }}
                        className="font-bold rounded-none p-0 text-center"
                      >
                        {production.number}
                      </SelectcoM>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between relative">
              <Button
                className="mt-auto mr-auto  rounded-none text-lg hover:opacity-80"
                variant={"default"}
                onClick={async () => {
                  if (!id) {
                    toast.error("You must select a production plan", {
                      duration: 1000,
                    });
                    return;
                  }
                  if (MainProducts.length === 0) {
                    toast.error("You must select a production plan", {
                      duration: 1000,
                    });
                    return;
                  }
                  const { status, message } = await SaveProduction({
                    MainProducts,
                    RawMaterials,
                    productionPlanID: id as string,
                    orgid: orgid as string,
                  });
                  if (status === "ok") {
                    toast.success(message);
                    clearData();
                  } else {
                    toast.error(message);
                  }
                }}
              >
                Save Production Order
              </Button>
            </div>
          </div>
          <div className="max-w-full overflow-y-auto ">
            <table className="w-full  border border-stone-300">
              <thead className={`bg-[#fafafa]`}>
                <tr>
                  <th className="px-2 w-[5%] border border-stone-300">#</th>
                  <th className="w-[55%] border border-stone-300">Item</th>
                  <th className="w-[10%] whitespace-nowrap border border-stone-300">Quantity</th>
                  <th className="w-[10%] whitespace-nowrap border border-stone-300">Produced</th>
                </tr>
              </thead>
              <tbody>
                {items.length < 1 && (
                  <tr>
                    <td className="border border-stone-300 text-center"></td>
                    <td className="w-[55%]  py-4  font-bold text-base border border-stone-300"></td>

                    <td className="w-[10%] text-center font-bold border border-stone-300"></td>
                    <td className="w-[10%] text-center font-bold border border-stone-300"></td>
                  </tr>
                )}
                {items?.map((item, i) => (
                  <tr key={i}>
                    <td className="border border-stone-300 text-center">{i + 1}</td>
                    <td className="w-[55%] px-2 bg font-bold text-base border border-stone-300">
                      {item.name}
                    </td>

                    <td className="w-[10%] text-center font-bold border border-stone-300">
                      {item.quantity}
                    </td>
                    <td className="w-[10%] text-center font-bold border border-stone-300">
                      {item.produced}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto w-full mt-3 relative">
        <div>
          <div className="flex items-center gap-2 pb-2 h-fit">
            <SelectItem type="product" addItem={AddMainProduct} products={FilterdProductsD} />
          </div>
          <ItemsTable
            type="product"
            items={MainProducts}
            deleteItem={DeleteProduct}
            updateItem={updateProduct}
          />
        </div>
        <div>
          <div className="flex items-center gap-2 pb-2 h-fit">
            <SelectItem type="raw" addItem={AddRawMaterial} products={products} />
          </div>
          <ItemsTable
            type="raw"
            items={RawMaterials}
            deleteItem={DeleteRawMaterial}
            updateItem={updateRawMaterial}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductionPage;

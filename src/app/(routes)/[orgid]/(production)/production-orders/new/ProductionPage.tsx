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

const ProductionPage: React.FC<ProductionPageT> = ({
    products,
    productionPlans,
}) => {
    const [id, setid] = useState<string | undefined>(undefined);
    const store = useProdcutionStore();
    const params: { orgid: string } = useParams();

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
    const items:
        | {
              id: string;
              name: string;
              unit: string;
              quantity: number;
              produced: number;
          }[] = CurrentPlan
        ? CurrentPlan.lineItems.map((item, i) => {
              return {
                  id: item.product.id,
                  name: item.product.name,
                  unit: item.product.unit?.name as string,
                  quantity: item.quantity,
                  produced: 0,
              };
          })
        : [];
    CurrentPlan?.ProductionEvents.map((ProductionEvent, i) => {
        ProductionEvent.lineItems?.map((itemDDD) => {
            const itemD = items?.find(
                (itemDD) => itemDD.id === itemDDD.product.id
            );
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
            const isITemAdded = MainProducts.find(
                (itemD) => itemD.id === item.id
            );
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
        <div className=" flex flex-col w-full h-full gap-1 p-4   rounded-md  mx-auto">
            <div className="w-full text-center font-bold text-2xl">
                امر انتاج جديد
            </div>
            <div className="flex gap-2">
                <div className="basis-[60%] mt-4 flex flex-col gap-2 relative">
                    <Button
                        className="order-last mt-auto"
                        variant={"default"}
                        onClick={async () => {
                            if (!id) {
                                toast.error("يجب تحديد خطة انتاج");
                                return;
                            }
                            const { status, data, message } =
                                await SaveProduction({
                                    MainProducts,
                                    RawMaterials,
                                    productionPlanID: id as string,
                                    orgid: params.orgid,
                                });
                            if (status === "ok") {
                                toast.success(message);
                                clearData();
                            } else {
                                toast.error(message);
                            }
                        }}
                    >
                        حفظ امر الانتاج
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 pb-2 h-fit">
                            <SelectItem
                                type="product"
                                addItem={AddMainProduct}
                                products={FilterdProductsD}
                            />
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
                            <SelectItem
                                type="raw"
                                addItem={AddRawMaterial}
                                products={products}
                            />
                        </div>
                        <ItemsTable
                            type="raw"
                            items={RawMaterials}
                            deleteItem={DeleteRawMaterial}
                            updateItem={updateRawMaterial}
                        />
                    </div>
                </div>
                <div className="basis-[40%]">
                    <div className="flex flex-col  ">
                        <div className="flex gap-2 items-center  mb-3">
                            <div className="text-lg font-bold whitespace-nowrap">
                                خطة انتاج
                            </div>
                            <Select
                                onValueChange={(value) => {
                                    id === value
                                        ? setid(undefined)
                                        : setid(value);
                                    clearData();
                                }}
                            >
                                <SelectTrigger className="w-[200px] py-0 text-center justify-center flex items-center  rounded-none border border-neutral-950 font-bold text-lg  focus:ring-offset-0 select-none">
                                    <SelectValue
                                        placeholder="قم باختيار خطة الانتاج "
                                        className="font-bold  text-center"
                                    >
                                        {
                                            productionPlans.find(
                                                (item) => item.id === id
                                            )?.number
                                        }
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
                        <table className="w-full bg-white border border-stone-300">
                            <thead className={`bg-[#fafafa]`}>
                                <tr>
                                    <th className="px-2 w-[5%] border border-stone-300">
                                        م
                                    </th>
                                    <th className="w-[55%] border border-stone-300">
                                        الصـــــــــــــــــنف
                                    </th>
                                    <th className="w-[10%] whitespace-nowrap border border-stone-300">
                                        الكمية
                                    </th>
                                    <th className="w-[10%] whitespace-nowrap border border-stone-300">
                                        ما تم انتاجه
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.map((item, i) => (
                                    <tr key={i}>
                                        <td className="border border-stone-300 text-center">
                                            {i + 1}
                                        </td>
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
        </div>
    );
};

export default ProductionPage;

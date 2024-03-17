"use client";

import { Button } from "@/components/ui/button";
import { useMemo, useCallback, useRef } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import useProdcutionStore, {
    ProductionProduct,
} from "@/lib/zustand/productionStore";
import { cn } from "@/lib/utils";
import { Part } from "@prisma/client";
import { useIsClient } from "@uidotdev/usehooks";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface SelectProductT {
    type: "raw" | "product" | "plan" | "InitaliQuantties";
    products:
        | {
              id: string;
              name: string;
              isAComposistion?: boolean;
              avaliableQuantity?: number;
              unit: string;
              parts?: Part[];
              maxquantity?: number;
          }[];
    addItem: (product: ProductionProduct) => void;
}

const SelectItem: React.FC<SelectProductT> = ({ products, addItem, type }) => {
    const [open, setOpen] = React.useState(false);

    const ProductionStore = useProdcutionStore();
    const productionPlanProducts = useProdcutionStore(
        (state) => state.productionPlanProducts
    );

    const productionStoreRef = useRef(ProductionStore);

    useEffect(() => {
        // console.log("useEffect run");

        if (type !== "plan") return;
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
                            addItem({
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
                    addItem({
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
    }, [productionPlanProducts, addItem, products, type]);

    const [productD, setproduct] = useState<{
        id: string | undefined;
        name: string | undefined;
        avaliableQuantity: number | undefined;
        isAComposistion?: boolean | undefined;
        quantiy: number | undefined;
        unit: string | undefined;
        parts?: Part[] | undefined;
        maxquantity?: number;
    }>({
        id: undefined,
        name: undefined,
        avaliableQuantity: undefined,
        isAComposistion: undefined,
        quantiy: undefined,
        unit: undefined,
        parts: undefined,
    });

    const [value, setValue] = React.useState("");
    const isClient = useIsClient();
    if (!isClient) return null;

    // remove the plan type specific code and make it reusable
    const addProduct = () => {
        if (
            !productD ||
            productD.avaliableQuantity === undefined ||
            !productD.quantiy ||
            !productD.id ||
            !productD.name ||
            !productD.unit
        )
            return;
        if (type === "plan") {
            ProductionStore.AddProductionPlanProduct({
                id: productD.id,
                avaliableQuanttiy: productD.avaliableQuantity,
                name: productD.name,
                Quantity: productD.quantiy,
                unit: productD.unit,
            });
        } else {
            addItem({
                id: productD.id,
                avaliableQuanttiy: productD.avaliableQuantity,
                name: productD.name,
                Quantity: productD.quantiy,
                unit: productD.unit,
            });
        }
        setproduct({
            id: undefined,
            name: undefined,
            avaliableQuantity: undefined,
            isAComposistion: undefined,
            quantiy: undefined,
            unit: undefined,
            parts: undefined,
        });
    };
    return (
        <div className="flex  gap-2 items-end text-black ">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="flex flex-col">
                        {type === "plan" ? null : (
                            <span className="xl:font-bold xl:text-lg pb-1 text-base font-semibold  ">
                                {type === "raw"
                                    ? "الاصناف المستخدمة في الانتاج:"
                                    : "الاصناف المنتجة:"}
                            </span>
                        )}
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="xl:w-[400px] w-[300px] justify-between font-semibold text-sm xl:text-sm border-2 border-sky-500 h-8 xl:h-10 rounded-none"
                        >
                            {productD.id
                                ? products?.find(
                                      (product) => product.id === productD.id
                                  )?.name
                                : "اضافة صنف"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 mr-auto" />
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="xl:w-[400px] w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="ابحث عن صنف..." />
                        <CommandEmpty>لا يوجد صنف بهذا الاسم</CommandEmpty>
                        <CommandGroup className=" overflow-auto max-h-[400px]">
                            {products.map((product) => {
                                if (type === "product") {
                                    return (
                                        <CommandItem
                                            className="font-semibold text-base border-b border-stone-300 rounded-none "
                                            key={product.id}
                                            value={product.name}
                                            onSelect={() => {
                                                setproduct({
                                                    ...productD,
                                                    avaliableQuantity:
                                                        product.avaliableQuantity,
                                                    id: product.id,
                                                    name: product.name,
                                                    unit: product.unit,
                                                    parts: product.parts,
                                                    isAComposistion:
                                                        product.isAComposistion,
                                                    quantiy: 0,
                                                    maxquantity:
                                                        product.maxquantity,
                                                });
                                                setValue(
                                                    product.id === value
                                                        ? ""
                                                        : product.id
                                                );

                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "ml-2 h-4 w-4",
                                                    value === product.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {product.name}
                                        </CommandItem>
                                    );
                                } else {
                                    return (
                                        <CommandItem
                                            className="font-semibold text-base"
                                            key={product.id}
                                            value={product.name}
                                            onSelect={() => {
                                                setproduct({
                                                    ...productD,
                                                    avaliableQuantity:
                                                        product.avaliableQuantity,
                                                    id: product.id,
                                                    name: product.name,
                                                    unit: product.unit,
                                                    parts: product.parts,
                                                    isAComposistion:
                                                        product.isAComposistion,
                                                    quantiy: 0,
                                                    maxquantity:
                                                        product.maxquantity,
                                                });
                                                setValue(
                                                    product.id === value
                                                        ? ""
                                                        : product.id
                                                );

                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === product.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {product.name}
                                        </CommandItem>
                                    );
                                }
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <div>
                <span>الكمية</span>
                <Input
                    type="number"
                    value={productD?.quantiy || 0}
                    min={1}
                    className="w-[100px] text-center border-2 border-sky-500 rounded-none  font-bold h-8 xl:h-10 text-base xl:text-lg"
                    onChange={(e) => {
                        if (type != "product") {
                            setproduct({
                                ...productD,
                                quantiy: e.target.valueAsNumber,
                            });
                        } else {
                            productD.maxquantity &&
                            e.target.valueAsNumber <= productD.maxquantity
                                ? setproduct({
                                      ...productD,
                                      quantiy: e.target.valueAsNumber,
                                  })
                                : (toast.remove(),
                                  toast.error(
                                      "الكمية المدخلة اكبر من المسموح بإنتاجها",
                                      {
                                          duration: 2000,
                                      }
                                  ));
                        }
                    }}
                />
            </div>
            <Button
                onClick={addProduct}
                className=" bg-sky-500 hover:bg-sky-400 text-black text-base xl:text-lg font-semibold xl:font-bold h-8 xl:h-10 rounded-sm"
            >
                اضافة
            </Button>
        </div>
    );
};

export default SelectItem;

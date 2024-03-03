"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ProductionProduct } from "@/lib/productionStore";

import { cn } from "@/lib/utils";
import { useIsClient } from "@uidotdev/usehooks";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Part } from "@prisma/client";

const initialProductState: Partial<{
    id: string;
    name: string;
    avaliableQuantity: number;
    isAComposistion?: boolean;
    quantiy: number;
    unit: string;
    parts?: Part[];
}> = {};
interface SelectProductT {
    type: "raw" | "product" | "plan";
    products: {
        id: string;
        name: string;
        isAComposistion?: boolean;
        avaliableQuantity: number;
        unit: string;
        parts?: Part[];
    }[];
    addItem: (product: ProductionProduct) => void;
}

const SelectItem: React.FC<SelectProductT> = ({ products, addItem, type }) => {
    console.log(products);

    const [open, setOpen] = React.useState(false);
    const [productD, setproduct] = useState<{
        id: string | undefined;
        name: string | undefined;
        avaliableQuantity: number | undefined;
        isAComposistion?: boolean | undefined;
        quantiy: number | undefined;
        unit: string | undefined;
        parts?: Part[] | undefined;
    }>({
        id: undefined,
        name: undefined,
        avaliableQuantity: undefined,
        isAComposistion: undefined,
        quantiy: undefined,
        unit: undefined,
        parts: undefined,
    });
    console.log(productD);

    const [value, setValue] = React.useState("");
    const isClient = useIsClient();
    if (!isClient) return null;

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

        if (productD.isAComposistion) {
            productD.parts?.map((part) => {
                const product = products.find(
                    (product) => product.id === part.partProductId
                );
                // console.log(product);
                if (product) {
                    addItem({
                        id: product.id,
                        avaliableQuanttiy: product.avaliableQuantity,
                        name: product.name,
                        Quantity: part.quantity * (productD.quantiy || 1),
                        unit: product.unit,
                    });
                }
            });
            setproduct({
                id: undefined,
                name: undefined,
                avaliableQuantity: undefined,
                isAComposistion: undefined,
                quantiy: undefined,
                unit: undefined,
                parts: undefined,
            });
        } else {
            addItem({
                id: productD.id,
                avaliableQuanttiy: productD.avaliableQuantity,
                name: productD.name,
                Quantity: productD.quantiy,
                unit: productD.unit,
            });
            setproduct({
                id: undefined,
                name: undefined,
                avaliableQuantity: undefined,
                isAComposistion: undefined,
                quantiy: undefined,
                unit: undefined,
                parts: undefined,
            });
        }
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
                                ? products.find(
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
                                    if (product.isAComposistion) return;
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
                    className="w-[100px] text-center border-2 border-sky-500 rounded-none  font-bold h-8 xl:h-10 text-base xl:text-lg"
                    onChange={(e) => {
                        setproduct({
                            ...productD,
                            quantiy: e.target.valueAsNumber,
                        });
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

"use client";

import { Button } from "@/components/ui/button";
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
import { ProductionProduct } from "@/lib/zustand/productionStore";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PartT } from "@/lib/types";

interface SelectProductT {
    type: "raw" | "product" | "plan" | "InitaliQuantties";
    products:
        | {
              id: string;
              name: string;
              isAComposistion?: boolean;
              avaliableQuantity?: number;
              unit: string;
              parts?: PartT[];
              maxquantity?: number;
          }[];
    addItem: (product: ProductionProduct) => void;
}

const SelectItem: React.FC<SelectProductT> = ({ products, addItem, type }) => {
    const [open, setOpen] = React.useState(false);

    const [productD, setproduct] = useState<{
        id: string;
        name: string;
        avaliableQuantity: number;
        isAComposistion: boolean;
        quantiy: number;
        unit: string;
        parts: PartT[] | [];
        maxquantity: number;
    }>({
        id: "",
        name: "",
        avaliableQuantity: 0,
        isAComposistion: false,
        quantiy: 0,
        unit: "",
        parts: [],
        maxquantity: 0,
    });
    useEffect(() => {
        setproduct({
            id: "",
            name: "",
            avaliableQuantity: 0,
            isAComposistion: false,
            quantiy: 0,
            unit: "",
            parts: [],
            maxquantity: 0,
        });
    }, [products]);

    const [value, setValue] = React.useState("");

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

        addItem({
            id: productD.id,
            avaliableQuanttiy: productD.avaliableQuantity,
            name: productD.name,
            Quantity: productD.quantiy,
            unit: productD.unit,
        });

        setproduct({
            id: "",
            name: "",
            avaliableQuantity: 0,
            isAComposistion: false,
            quantiy: 0,
            unit: "",
            parts: [],
            maxquantity: 0,
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
                                    : type === "product"
                                    ? "الاصناف المنتجة:"
                                    : ""}
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
                            {products.length === 0 && (
                                <CommandItem className="font-semibold text-base border-b border-stone-300 rounded-none flex  justify-center  ">
                                    <span className="text-red-500">
                                        لم تقم باختيار خطة انتاج
                                    </span>
                                </CommandItem>
                            )}
                            {products.map((product) => {
                                return (
                                    <CommandItem
                                        className="font-semibold text-base border-b border-stone-300 rounded-none "
                                        key={product.id}
                                        value={product.name}
                                        onSelect={() => {
                                            setproduct({
                                                ...productD,
                                                avaliableQuantity:
                                                    product.avaliableQuantity ||
                                                    0,
                                                id: product.id,
                                                name: product.name,
                                                unit: product.unit,
                                                parts: product.parts || [],
                                                isAComposistion:
                                                    product.isAComposistion ||
                                                    false,
                                                quantiy: 0,
                                                maxquantity:
                                                    product.maxquantity || 0,
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

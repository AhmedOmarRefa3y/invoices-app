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
import useProdcutionStore, { ProductionProduct } from "@/lib/productionStore";

import { cn } from "@/lib/utils";
import { Part } from "@prisma/client";
import { useIsClient } from "@uidotdev/usehooks";
import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import { inventoryT } from "@/app/inventory/tableComponents/columns";

interface SelectProductT {
    products: ProductionProduct[];
}

const SelectProduct: React.FC<SelectProductT> = ({ products }) => {
    const [open, setOpen] = React.useState(false);
    const [productD, setproduct] = useState<Partial<ProductionProduct>>();
    const [value, setValue] = React.useState("");
    const ProductionStore = useProdcutionStore();
    const { AddMainProduct } = ProductionStore;
    const isClient = useIsClient();
    if (!isClient) return null;

    const addProduct = () => {};
    return (
        <>
            <span className="">الصنف المراد انتاجه</span>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {value
                            ? products.find((product) => product.id === value)
                                  ?.name
                            : "اختر الصنف"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                    <Command>
                        <CommandInput placeholder="ابحث عن صنف..." />
                        <CommandEmpty>لا يوجد صنف بهذا الاسم</CommandEmpty>
                        <CommandGroup className="h-[500px] overflow-scroll w-[400px]">
                            {products.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => {
                                        setproduct({
                                            ...productD,
                                            avaliableQuanttiy:
                                                product.avaliableQuanttiy,
                                            id: product.id,
                                            name: product.name,
                                            QuantityToProduce:
                                                product.QuantityToProduce,
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
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <Input
                type="number"
                value={productD?.QuantityToProduce}
                className="w-fit"
                onChange={(e) => {
                    setproduct({
                        ...productD,
                        QuantityToProduce: e.target.valueAsNumber,
                    });
                    console.log(productD);
                }}
            />
            <Button onClick={addProduct}>اضافة</Button>
        </>
    );
};

export default SelectProduct;

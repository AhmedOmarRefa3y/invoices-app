"use client";
import {
    SelectValue,
    SelectTrigger,
    SelectLabel,
    SelectItem,
    SelectGroup,
    SelectContent,
    Select,
} from "@/components/ui/Select";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import useProdcutionStore from "@/lib/productionStore";
import { useIsClient } from "@uidotdev/usehooks";
import React, { useState } from "react";
import { ProductionProduct } from "@/lib/types";
import { Part } from "@prisma/client";
import { Input } from "../ui/input";

interface SelectProductT {
    products: ProductionProduct[];
}
const SelectProduct: React.FC<SelectProductT> = ({ products }) => {
    const [open, setOpen] = React.useState(false);
    const [productD, setproduct] = useState<{
        productId: string | undefined;
        name: string | undefined;
        quantity?: number | undefined;
        parts?: Part[] | undefined;
    }>({
        productId: undefined,
        name: undefined,
        quantity: undefined,
        parts: undefined,
    });
    const [value, setValue] = React.useState("");
    const ProductionStore = useProdcutionStore();
    const { AddMainProduct } = ProductionStore;
    const isClient = useIsClient();
    if (!isClient) return null;

    const addProduct = () => {
        const components =
            productD.parts && productD.parts.length > 0
                ? productD.parts
                : undefined;
        const parts = components?.map((part) => {
            return {
                name: part.name,
                productId: part.partProductId as string,
                quantity: part.quantity * (productD.quantity || 1),
            };
        });
        parts
            ? parts.map((part) => {
                  AddMainProduct(part);
              })
            : AddMainProduct({
                  name: productD.name as string,
                  productId: productD.productId as string,
                  quantity: productD.quantity,
              });
    };
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
                            ? products.find(
                                  (product) => product.productId === value
                              )?.name
                            : "Select framework..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search framework..." />
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {products.map((product) => (
                                <CommandItem
                                    key={product.productId}
                                    value={product.productId}
                                    onSelect={(currentValue) => {
                                        setproduct({
                                            ...productD,
                                            name: product.name,
                                            productId: product.productId,
                                            parts: product.parts,
                                            quantity: 0,
                                        });
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );

                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === product.productId
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
                className="w-fit"
                onChange={(e) => {
                    setproduct({
                        ...productD,
                        quantity: e.target.valueAsNumber,
                    });
                    console.log(productD);
                }}
            />
            <Button onClick={addProduct}>اضافة</Button>
        </>
    );
};

export default SelectProduct;

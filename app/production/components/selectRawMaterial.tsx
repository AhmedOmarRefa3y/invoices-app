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
import useProdcutionStore from "@/lib/productionStore";

import { cn } from "@/lib/utils";
import { useIsClient } from "@uidotdev/usehooks";
import React, { useState } from "react";
import { Input } from "../../../components/ui/input";

interface SelectRawMaterial {
    products: {
        id: string;
        name: string;
        avaliableQuantity: number;
        unit: string;
    }[];
}

const SelectRawMaterial: React.FC<SelectRawMaterial> = ({ products }) => {
    const [open, setOpen] = React.useState(false);
    const [RawMaterial, setRawMaterial] = useState<{
        id: string | undefined;
        name: string | undefined;
        avaliableQuantity: number | undefined;
        quantity: number | undefined;
        unit: string | undefined;
    }>({
        id: undefined,
        name: undefined,
        avaliableQuantity: undefined,
        quantity: undefined,
        unit: undefined,
    });
    const [value, setValue] = React.useState("");
    const ProductionStore = useProdcutionStore();
    const { AddRawMaterial } = ProductionStore;
    const isClient = useIsClient();
    if (!isClient) return null;

    const addProduct = () => {
        console.log(RawMaterial);
        if (
            !RawMaterial ||
            !RawMaterial.avaliableQuantity ||
            !RawMaterial.quantity ||
            !RawMaterial.id ||
            !RawMaterial.name
        )
            return;

        AddRawMaterial({
            avaliableQuanttiy: RawMaterial.avaliableQuantity,
            id: RawMaterial.id,
            name: RawMaterial.name,
            Quantity: RawMaterial.quantity,
            unit: RawMaterial.unit,
        });
    };
    return (
        <>
            <span className="">اضافة مادة خام</span>
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
                            : "اختر المادة الخام...."}
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
                                        setRawMaterial({
                                            ...RawMaterial,
                                            avaliableQuantity:
                                                product.avaliableQuantity,
                                            id: product.id,
                                            name: product.name,
                                            unit: product.unit,
                                            quantity: 0,
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
                value={RawMaterial?.quantity}
                className="w-fit"
                onChange={(e) => {
                    setRawMaterial({
                        ...RawMaterial,
                        quantity: e.target.valueAsNumber,
                    });
                    console.log(RawMaterial);
                }}
            />
            <Button onClick={addProduct}>اضافة</Button>
        </>
    );
};

export default SelectRawMaterial;

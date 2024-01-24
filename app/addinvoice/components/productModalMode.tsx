"use client";

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

interface ProductModalModeT {
    setType: (id: number) => void;
    type: number;
}
const ProductModalMode: React.FC<ProductModalModeT> = ({ setType, type }) => {
    const types = [
        { id: 1, name: "صنف عادي" },
        { id: 2, name: "صنف مجمع" },
    ];

    return (
        <div className="flex items-center flex-col font-extrabold">
            <label htmlFor="">نوع الصنف</label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        size="sm"
                        role="combobox"
                        className={cn(
                            `w-[120px] mt-[8px] justify-center gap-1 h-[40px] font-extrabold text-lg`
                        )}
                    >
                        {type
                            ? types.find((typeItem) => typeItem.id === type)
                                  ?.name
                            : "نوع الفاتورة"}
                        <ChevronsUpDown className="  w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className=" p-2 w-[160px] ">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {types.map((typeItem) => (
                                    <div
                                        key={typeItem.id}
                                        className=" flex justify-between items-center text-lg font-extrabold"
                                    >
                                        <CommandItem
                                            key={typeItem.id}
                                            onSelect={() => {
                                                setType(typeItem.id);
                                            }}
                                            className="text-sm w-full text-center"
                                        >
                                            <span className="w-full text-lg">
                                                {typeItem.name}
                                            </span>
                                            <Check
                                                className={cn(
                                                    "mr-auto w-4",
                                                    typeItem.id === type
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    </div>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default ProductModalMode;

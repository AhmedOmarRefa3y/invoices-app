"use client";
import { Customer, Prisma } from "@prisma/client";
import React, { useState } from "react";
import AddInvoicePage from "./AddInvoicePage";

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Check, ChevronsUpDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import ReturnedInvoicePage from "./returnedInvoicePage";

interface InvoiceProps {
    customersBalannces: {
        id: string;
        name: string;
        TotalPayments: number;
        InvoiceTotal: number;
    }[];
    customers: Customer[];
    products: Product[];
}

type Product = Prisma.ProductGetPayload<{
    include: {
        Inventory: true;
        Parts: true;
    };
}>;
const Rendreing: React.FC<InvoiceProps> = ({
    customers,
    products,
    customersBalannces,
}) => {
    const [IsPopoverOpen, setPopoverOpen] = useState(false);
    const [ModeID, setModeID] = useState(1);
    const Modes = [
        { id: 1, name: "مبيعات" },
        { id: 2, name: "مرتجع" },
    ];

    return (
        <div>
            <div>
                <label htmlFor="">نوع الفاتورة</label>
                <Popover>
                    <div className="overflow-hidden ">
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                size="sm"
                                role="combobox"
                                aria-expanded={IsPopoverOpen}
                                className={cn(
                                    `w-[120px] mt-[8px] justify-center gap-1 h-[40px] `
                                )}
                            >
                                {ModeID
                                    ? Modes.find((Mode) => Mode.id === ModeID)
                                          ?.name
                                    : "نوع الفاتورة"}
                                <ChevronsUpDown className="  w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                    </div>
                    <PopoverContent className=" p-2 w-[160px]">
                        <Command>
                            <CommandList>
                                <CommandGroup>
                                    {Modes.map((Mode) => (
                                        <div className=" flex justify-between items-center ">
                                            <CommandItem
                                                key={Mode.id}
                                                onSelect={() => {
                                                    setModeID(Mode.id);
                                                }}
                                                className="text-sm w-full text-center"
                                            >
                                                <span className="w-full">
                                                    {Mode.name}
                                                </span>
                                                <Check
                                                    className={cn(
                                                        "mr-auto w-4",
                                                        Mode.id === ModeID
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

            {ModeID === 1 ? (
                <AddInvoicePage
                    products={products}
                    customers={customers}
                    customersBalannces={customersBalannces}
                />
            ) : (
                <ReturnedInvoicePage
                    products={products}
                    customers={customers}
                    customersBalannces={customersBalannces}
                />
            )}
        </div>
    );
};

export default Rendreing;

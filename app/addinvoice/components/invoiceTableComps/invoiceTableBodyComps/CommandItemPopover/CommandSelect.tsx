import React from "react";
import { Button } from "@/components/ui/button";

import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useInvoice, { InvoiceItem } from "@/lib/zustand";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import CommandItemHeader from "./CommandHeader";
import CommandItemUi from "./CommandItem";
import { Prisma } from "@prisma/client";

export type product = Prisma.ProductGetPayload<{
    include: {
        Part: true;
    };
}>;

const CommandItemSelect = ({
    item,
    products,
}: {
    item: InvoiceItem;
    products: product[];
}) => {
    const DataStore = useInvoice();
    const { SetAddProdctModalIsOpen } = DataStore;
    return (
        <td
            align="center"
            className="p-0 font-semibold text-black duration-300 border border-black hover:bg-gray-400"
        >
            <div className="flex items-center h-full">
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center w-full h-full ">
                            <div
                                className={cn(
                                    `flex justify-between h-full bg-none w-full px-2 cursor-pointer   `
                                )}
                            >
                                <div>{item.name}</div>
                                <ChevronsUpDown className="w-4 shrink-0 " />
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px] p-0 ">
                        <Command>
                            <CommandList>
                                <CommandItemHeader />
                                <CommandGroup className="overflow-y-hidden">
                                    {products.map((productInfo) => (
                                        <CommandItemUi
                                            item={item}
                                            productInfo={productInfo}
                                        />
                                    ))}
                                </CommandGroup>
                            </CommandList>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        SetAddProdctModalIsOpen(true)
                                    }
                                    className="w-full text-xl rounded-none hover:bg-yellow-400 bg-yellow-200 "
                                >
                                    اضافة صنف
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                </Button>
                            </div>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </td>
    );
};

export default CommandItemSelect;

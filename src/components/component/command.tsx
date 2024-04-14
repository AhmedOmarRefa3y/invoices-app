"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand/invoiceStore";

interface ComboboxT {
    data: { value: any; id: string }[];
    onSelect: (item: { value: any; id: string }) => void;
    selectedID: string | undefined;
    type?: "Unit" | "Category" | "Type";
}

export const Combobox: React.FC<ComboboxT> = ({
    data,
    onSelect,
    selectedID,
    type,
}) => {
    const invoiceStore = useInvoice();
    const [open, setOpen] = React.useState(false);
    const [Id, setId] = React.useState<string | undefined>(selectedID);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between overflow-hidden p-1 text-lg  font-bold px-2 border-stone-300   ${
                        Id ? "text-black" : "text-black/60"
                    } `}
                >
                    {Id
                        ? data.find((item) => item.id === selectedID)?.value
                        : "اختر هنا"}
                    <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 " side="bottom">
                <Command>
                    <CommandGroup className=" w-full">
                        {data.map((item) => (
                            <CommandItem
                                key={item.value}
                                className="flex justify-between w-full font-bold"
                                onSelect={() => {
                                    setId(item.id === Id ? "" : item.id);
                                    setOpen(false);
                                    onSelect(item);
                                }}
                            >
                                {item.value}
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        Id === item.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                        {type === "Unit" && (
                            <Button
                                className="bg-transparent w-full grow block inset-0 rounded-md  text-white py-1 m-0 h-fit px-2 bg-sky-500 hover:bg-sky-400 mx-auto"
                                onClick={() => {
                                    console.log("clicked");
                                    invoiceStore.setAddUnitModalIsOpen(true);
                                }}
                            >
                                اضافة وحدة
                            </Button>
                        )}
                        {type === "Category" && (
                            <Button
                                className="bg-transparent w-full grow block inset-0 rounded-md   text-white py-1 m-0 h-fit px-2 bg-sky-500 hover:bg-sky-400 mx-auto"
                                onClick={() => {
                                    console.log("clicked");
                                    invoiceStore.setAddInventoryModalIsOpen(
                                        true
                                    );
                                }}
                            >
                                اضافة مخزن
                            </Button>
                        )}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

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
import useModals from "@/lib/zustand/useModals";

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
    const Modals = useModals();
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
                        : "Select"}
                    <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[200px] p-0 rounded-none border border-stone-300 m-0 "
                side="bottom"
            >
                <Command className="rounded-none border-0">
                    <CommandGroup className=" w-full p-0 rounded-none">
                        {data.map((item) => (
                            <CommandItem
                                key={item.value}
                                className="flex justify-center w-full font-bold rounded-none py-2 text-center text-base"
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
                                variant={"default"}
                                className=" w-full rounded-none py-2 h-fit hover:bg-black/80 "
                                onClick={() => {
                                    Modals.setAddUnitModalIsOpen(true);
                                }}
                            >
                                Add Unit
                            </Button>
                        )}
                        {type === "Category" && (
                            <Button
                                className=" w-full rounded-none py-2 h-fit hover:bg-black/80 "
                                onClick={() => {
                                    console.log("clicked");
                                    Modals.setAddInventoryModalIsOpen(true);
                                }}
                            >
                                Add Inventory
                            </Button>
                        )}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

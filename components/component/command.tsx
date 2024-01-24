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

interface ComboboxT {
    data: { value: any; id: string | number }[];
    onSelect: (item: { value: any; id: string  }) => void;
}

export const Combobox: React.FC<ComboboxT> = ({ data, onSelect }) => {
    const [open, setOpen] = React.useState(false);
    const [Id, setId] = React.useState<string | number>("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between overflow-hidden p-1  font-bold border-2 border-black"
                >
                    {Id
                        ? data.find((item) => item.id === Id)?.value
                        : "اختر هنا"}
                    <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 " side="bottom">
                <Command>
                    <CommandGroup className="">
                        {data.map((item) => (
                            <CommandItem
                                key={item.value}
                                onSelect={() => {
                                    setId(item.id === Id ? "" : item.id);
                                    setOpen(false);
                                    onSelect(item);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        Id === item.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {item.value}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

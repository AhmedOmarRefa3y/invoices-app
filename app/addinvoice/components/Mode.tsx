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
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const Mode = () => {
    const PathName = usePathname();
    console.log(PathName);

    const [Mode, setMode] = useState(
        PathName === "/addinvoice/sales-returns" ? 2 : 1
    );
    const router = useRouter();
    const Modes = [
        { id: 1, name: "مبيعات" },
        { id: 2, name: "مرتجع" },
    ];

    return (
        <div className="flex items-center flex-col font-extrabold">
            <label htmlFor="">نوع الفاتورة</label>
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
                        {Mode
                            ? Modes.find((ModeItem) => ModeItem.id === Mode)
                                  ?.name
                            : "نوع الفاتورة"}
                        <ChevronsUpDown className="  w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className=" p-2 w-[160px]">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {Modes.map((ModeItem) => (
                                    <div
                                        key={ModeItem.id}
                                        className=" flex justify-between items-center text-lg font-extrabold"
                                    >
                                        <CommandItem
                                            key={ModeItem.id}
                                            onSelect={() => {
                                                setMode(ModeItem.id);
                                                router.push(
                                                    `/addinvoice/${
                                                        ModeItem.id === 1
                                                            ? "sales"
                                                            : "sales-returns"
                                                    }`
                                                );
                                            }}
                                            className="text-sm w-full text-center"
                                        >
                                            <span className="w-full text-lg">
                                                {ModeItem.name}
                                            </span>
                                            <Check
                                                className={cn(
                                                    "mr-auto w-4",
                                                    ModeItem.id === Mode
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

export default Mode;

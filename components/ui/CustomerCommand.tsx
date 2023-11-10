"use client";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { AddNewCustomerModal } from "../addCustomerModal";
import { Button } from "../ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import React, { useState } from "react";
import { Customer } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

interface CustomerCommandProps {
    customers: Customer[];
    slug: string;
}

const CustomerCommandComp: React.FC<CustomerCommandProps> = ({
    customers,
    slug,
}) => {
    const router = useRouter();
    const [IsPopoverOpen, setPopoverOpen] = useState(false);
    const customer = customers.find((customer) => customer.id === slug);
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    return (
        <div className="w-full h-full">
            <Popover open={IsPopoverOpen} onOpenChange={setPopoverOpen}>
                <div>
                    <label htmlFor="">العميل</label>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            size="sm"
                            role="combobox"
                            aria-expanded={IsPopoverOpen}
                            aria-label="اختر اسم العميل"
                            className={cn("w-full justify-between")}
                        >
                            {customer ? customer.name : "اختر اسم العميل"}
                            <ChevronsUpDown className="ml-r h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                </div>
                <PopoverContent className="w-[250px] p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="ابحث بالاسم..." />
                            <CommandEmpty>
                                للا يوجد عميل بهذا الاسم
                            </CommandEmpty>
                            <CommandGroup>
                                {customers.map((customerInfo) => (
                                    <CommandItem
                                        key={customerInfo.id}
                                        onSelect={() => {
                                            params.set(
                                                "customerid",
                                                customerInfo.id
                                            );
                                            router.push(
                                                `/accountstatement/customerbalance/?${params.toString()}`
                                            );
                                        }}
                                        className="text-sm"
                                    >
                                        {/* <PersonStanding className="mr-2 h-4 w-4" /> */}
                                        {customerInfo.name}
                                        <Check
                                            className={cn(
                                                "mr-auto h-4 w-4 ",
                                                customerInfo?.id === slug
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        ></Check>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default CustomerCommandComp;

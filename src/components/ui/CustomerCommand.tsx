"use client";
import { cn } from "@/lib/utils";
import { Customer } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface CustomerCommandProps {
    customers: Customer[];
    slug: string;
}

const CustomerCommandComp: React.FC<CustomerCommandProps> = ({
    customers,
    slug,
}) => {
    const router = useRouter();
    const customer = customers.find((customer) => customer.id === slug);
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    return (
        <div className="flex flex-col w-full">
            <Popover>
                <div>
                    <label htmlFor="">Customer</label>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            size="sm"
                            role="combobox"
                            aria-label="Select customer name"
                            className={cn("w-full justify-between font-bold")}
                        >
                            {customer ? customer.name : "Select customer name"}
                            <ChevronsUpDown className="ml-r h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                </div>
                <PopoverContent className="w-fit p-0  z-50">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Search by name..." />
                            <CommandEmpty>
                                No customer with this name
                            </CommandEmpty>
                            <CommandGroup>
                                {customers.map((customerInfo) => (
                                    <CommandItem
                                        key={customerInfo.id}
                                        onSelect={() => {
                                            params.get("customerid") ===
                                            customerInfo.id
                                                ? params.set("customerid", "")
                                                : params.set(
                                                      "customerid",
                                                      customerInfo.id
                                                  );
                                            router.push(
                                                `${pathName}?${params.toString()}`
                                            );
                                        }}
                                        className="text-sm"
                                    >
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

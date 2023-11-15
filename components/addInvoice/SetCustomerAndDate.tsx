"use client";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { Customer } from "@prisma/client";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import React, { useState } from "react";
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
import InvoiceDate from "./InvoiceDate";

interface InvoiceHeaderProps {
    customers: Customer[];
}

const SetCustomerAndDate: React.FC<InvoiceHeaderProps> = ({ customers }) => {
    const Invoice = useInvoice();
    const { setCustomerId, customerId, clearData } = Invoice;
    const [IsPopoverOpen, setPopoverOpen] = useState(false);

    const customerIfno = customers.find((item) => item.id === customerId);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
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
                                {customerIfno
                                    ? customerIfno.name
                                    : "اختر اسم العميل"}
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
                                                if (
                                                    customerInfo.id ===
                                                    customerId
                                                ) {
                                                    setCustomerId(null);
                                                } else {
                                                    setCustomerId(
                                                        customerInfo.id
                                                    );
                                                }
                                            }}
                                            className="text-sm"
                                        >
                                            {/* <PersonStanding className="mr-2 h-4 w-4" /> */}
                                            {customerInfo.name}
                                            <Check
                                                className={cn(
                                                    "mr-auto h-4 w-4 ",
                                                    customerInfo?.id ===
                                                        customerId
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            ></Check>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                            <CommandSeparator />
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem className="flex justify-center">
                                        <AddNewCustomerModal />
                                        <PlusCircle className="mr-2  h-5 w-5" />
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            {/* prick a Date */}
            <div className="col-span-1">
                <InvoiceDate />
            </div>
            <Button className="w-fit mr-auto col-span-2" onClick={clearData}>
                جديد
            </Button>
        </div>
    );
};

export default SetCustomerAndDate;

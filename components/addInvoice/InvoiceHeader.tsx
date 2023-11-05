"use client";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/Select";
import { Customer } from "@prisma/client";
import useInvoice from "@/lib/zustand";
import { DatePickerDemo } from "./datePicker";
import AddNewCustomer from "../ui/addnewCustomer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
    Check,
    ChevronsUpDown,
    PersonStanding,
    PlusCircle,
} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "../ui/command";
import { cn } from "@/lib/utils";

interface InvoiceHeaderProps {
    customers: Customer[];
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ customers }) => {
    const [mounted, setmounted] = useState(false);
    const setCustomerId = useInvoice((state) => state.setCustomerId);
    const customerId = useInvoice((state) => state.customerId || "");
    const [IsPopoverOpen, setPopoverOpen] = useState(false);

    const customerIfno = customers.find((item) => item.id === customerId);
    useEffect(() => {
        setmounted(true);
    }, [mounted]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
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
                                {/* <PersonStanding className="mx-2 w-4" /> */}
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
                                            onSelect={() =>
                                                setCustomerId(customerInfo.id)
                                            }
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
                                        <AddNewCustomer />
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
                <DatePickerDemo />
            </div>
        </div>
    );
};

export default InvoiceHeader;

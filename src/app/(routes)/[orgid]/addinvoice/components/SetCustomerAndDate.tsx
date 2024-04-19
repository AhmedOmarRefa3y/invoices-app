"use client";
import { AddNewCustomerModalNEW } from "@/components/modals/addCustomerModal";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand/invoiceStore";
import { Customer } from "@prisma/client";
import { Check, ChevronsUpDown, Edit, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import InvoiceDate from "./InvoiceDate";
import { CommandSeparator } from "@/components/ui/command";

interface InvoiceHeaderProps {
    customers: Customer[];
}

const SetCustomerAndDate: React.FC<InvoiceHeaderProps> = ({ customers }) => {
    const Invoice = useInvoice();
    const {
        setCustomerId,
        customerId,
        SetAddcustomerModalIsOpen,
        setcustomerToBeEdited,
    } = Invoice;
    const [IsPopoverOpen, setPopoverOpen] = useState(false);

    const customerIfno = customers.find((item) => item.id === customerId);

    return (
        <div className="flex flex-wrap gap-2 w-full  font-bold text-lg grow">
            <div className="w-full sm:w-[250px]">
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
                                className={cn(
                                    "flex gap-2 w-full  h-9 justify-between items-center text-black font-bold text-base border-stone-300 rounded-none"
                                )}
                            >
                                {customerIfno
                                    ? customerIfno.name
                                    : "اختر اسم العميل"}
                                <ChevronsUpDown className="ml-r h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                    </div>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandList>
                                <CommandInput placeholder="ابحث بالاسم..." />
                                <CommandEmpty>
                                    للا يوجد عميل بهذا الاسم
                                </CommandEmpty>
                                <CommandGroup>
                                    {customers.map((customerInfo) => (
                                        <div
                                            key={customerInfo.id}
                                            className="flex justify-between items-center"
                                        >
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
                                                className="text-md font-bold flex justify-between w-full"
                                            >
                                                <span>{customerInfo.name}</span>
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
                                            <Edit
                                                className="hover:text-red-500 duration-150"
                                                onClick={() => {
                                                    setcustomerToBeEdited({
                                                        CreditType: "",
                                                        address:
                                                            customerInfo.location,
                                                        customerId:
                                                            customerInfo.id,
                                                        customerName:
                                                            customerInfo.name,
                                                        OpenCredit:
                                                            customerInfo.CustomerCredit,
                                                        PhoneNumber:
                                                            customerInfo.phoneNumber,
                                                    });
                                                    SetAddcustomerModalIsOpen(
                                                        true
                                                    );
                                                }}
                                            />
                                        </div>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                            <CommandSeparator />
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem className="flex justify-center">
                                        <Button
                                            variant="default"
                                            className="w-full font-bold"
                                            onClick={() =>
                                                SetAddcustomerModalIsOpen(true)
                                            }
                                        >
                                            اضافة عميل
                                            <PlusCircle className="mr-2  h-5 w-5" />
                                        </Button>
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="w-full sm:w-[250px]">
                <InvoiceDate />
            </div>
        </div>
    );
};

export default SetCustomerAndDate;

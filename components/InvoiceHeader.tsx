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
} from "./ui/Select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Customer } from "@prisma/client";
import useInvoice from "@/lib/zustand";
import { DatePickerDemo } from "./datePicker";

interface InvoiceHeaderProps {
    customers: Customer[];
    // customerId: string | null;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
    customers,
    // customerId,
}) => {
    const [mounted, setmounted] = useState(false);
    const setCustomerId = useInvoice((state) => state.setCustomerId);
    const customerId = useInvoice((state) => state.customerId);
    const [Customer, setCsutomer] = useState(customerId);

    useEffect(() => {
        setmounted(true);
    }, [mounted]);

    useEffect(() => {
        setCsutomer(customerId);
    }, [customerId]);

    if (!mounted) {
        return null;
    }
    return (
        <div className="flex w-full gap-2">
            {/* select Customer */}
            <div>
                <Select
                    onValueChange={(value) => {
                        setCustomerId(value);
                    }}
                    value={Customer || undefined}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Customer" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Customer</SelectLabel>
                            {customers.map((item) => (
                                <SelectItem value={item.id} key={item.id}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {/* prick a Date */}
            <DatePickerDemo />
        </div>
    );
};

export default InvoiceHeader;

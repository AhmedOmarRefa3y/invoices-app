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
import { Customer } from "@prisma/client";
import useInvoice from "@/lib/zustand";
import { DatePickerDemo } from "./datePicker";

interface InvoiceHeaderProps {
    customers: Customer[];
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ customers }) => {
    const [mounted, setmounted] = useState(false);
    const setCustomerId = useInvoice((state) => state.setCustomerId);
    const customerId = useInvoice((state) => state.customerId || "");
    useEffect(() => {
        setmounted(true);
    }, [mounted]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* select Customer */}
            <div className="col-span-1">
                <label htmlFor="">Customer</label>
                <Select
                    onValueChange={(value) => {
                        setCustomerId(value);
                    }}
                    key={customerId}
                    value={customerId}
                >
                    <SelectTrigger>
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
            <div className="col-span-1">
                <DatePickerDemo />
            </div>
        </div>
    );
};

export default InvoiceHeader;

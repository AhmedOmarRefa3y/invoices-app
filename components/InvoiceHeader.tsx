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

interface InvoiceHeaderProps {
    customers: Customer[];
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ customers }) => {
    const Invoice = useInvoice();
    const [date, setDate] = React.useState<Date>();
    const [customerID, setcustomerID] = useState<string>();
    useEffect(() => {
        if (date) {
            Invoice.invoice.date = date.toString();
        }
        if (customerID) {
            Invoice.invoice.customerId = customerID;
        }
        console.log(Invoice);
    }, [date, customerID]);

    return (
        <div className="flex w-full gap-2">
            {/* select Customer */}
            <div>
                <Select
                    onValueChange={(value) => {
                        setcustomerID(value);
                    }}
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
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                                format(date, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default InvoiceHeader;

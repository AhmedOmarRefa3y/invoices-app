"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import useInvoice from "@/lib/zustand";

export function DatePickerDemo() {
    const invoice = useInvoice();
    const { date, updateDate } = invoice;

    return (
        <Popover>
            <div className="flex flex-col">
                <label htmlFor="">تاريخ الفاتورة</label>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            " flex justify-between text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        {date ? (
                            format(new Date(date), "PPP")
                        ) : (
                            <span>اختر التاريخ</span>
                        )}
                        <CalendarIcon className="mr-2 h-4 w-4 " />
                    </Button>
                </PopoverTrigger>
            </div>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date ? date : new Date()}
                    onSelect={(value) => updateDate(value)}
                    initialFocus
                    dir="rtl"
                />
            </PopoverContent>
        </Popover>
    );
}

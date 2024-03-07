"use client";

import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function InvoiceDate() {
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
                            " flex justify-between items-center text-center h-9 w-60  text-black font-bold text-base",
                            !date && "text-muted-foreground"
                        )}
                    >
                        {date ? (
                            format(new Date(date), "PPP")
                        ) : (
                            <span>اختر التاريخ</span>
                        )}
                        <CalendarIcon className="mr-2 h-5 w-5 " />
                    </Button>
                </PopoverTrigger>
            </div>
            <PopoverContent className="w-auto p-0 text-black">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(value) => updateDate(value)}
                    initialFocus
                    dir="rtl"
                />
            </PopoverContent>
        </Popover>
    );
}

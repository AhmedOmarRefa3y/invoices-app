"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";

export default function InvoiceDate() {
    const invoice = usePurchaseInvoice();
    const { UpdateDate } = invoice;
    return (
        <Popover>
            <div className="flex flex-col">
                <label htmlFor="">تاريخ الفاتورة</label>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            " flex justify-between items-center text-center h-9 w-full sm:w-[250px]  text-black font-bold text-base border-stone-300 rounded-none",
                            !Date && "text-muted-foreground"
                        )}
                    >
                        {invoice.Date ? (
                            format(new Date(invoice.Date), "PPP")
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
                    selected={invoice.Date}
                    onSelect={(value) => UpdateDate(value)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

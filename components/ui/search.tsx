"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

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

interface DateSearchProps {
    filter: string;
    label: string;
}
const DateSearch: React.FC<DateSearchProps> = ({ filter, label }) => {
    const [mounted, setmounted] = React.useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = searchParams
        ? new URLSearchParams(searchParams)
        : new URLSearchParams();

    const filterValue = params.get(filter);
    const isValidFilterValue = filterValue && filterValue.length;

    const result = isValidFilterValue ? filterValue : undefined;
    return (
        <Popover>
            <div className="flex flex-col">
                <label htmlFor="">{label}</label>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            " flex justify-between text-left font-normal",
                            !result && "text-muted-foreground"
                        )}
                    >
                        {result ? (
                            format(new Date(result), "PPP")
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
                    selected={new Date(result || "") || undefined}
                    onSelect={(value) => {
                        params.set(filter, value?.toDateString() || "");
                        router.push(
                            `/accountstatement/customerbalance/?${params.toString()}`
                        );
                    }}
                    initialFocus
                    dir="rtl"
                />
            </PopoverContent>
        </Popover>
    );
};

export default DateSearch;

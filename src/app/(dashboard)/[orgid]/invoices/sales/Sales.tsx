"use client";
import { cn } from "@/lib/utils";
import {
    FileBarChart2,
    SidebarClose,
    SidebarOpen,
    ViewIcon,
} from "lucide-react";
import React, { useState } from "react";

interface SalesProps {
    SalesData: any;
}
const SalesOverView: React.FC<SalesProps> = ({ SalesData }) => {
    const [SHow, setSHow] = useState(false);
    return (
        <div
            className={`absolute xl:relative top-0 bottom-0 bg-white h-full xl:left-0 z-50 ${
                !SHow ? "-left-[300px]" : "left-0"
            }  w-[300px] xl:w-full border top-0 bottom-0  p-2 flex flex-col gap-2 duration-300 max-h-screen  shadow-sm `}
        >
            <span className="absolute left-0 top-0  xl:hidden ">
                <SidebarClose
                    className="sm:w-10 w-7 sm:h-10 h-7"
                    onClick={() => setSHow(!SHow)}
                />
            </span>
            <span
                className={cn(
                    "absolute -right-10 top-0  xl:hidden duration-300",
                    SHow && "opacity-0"
                )}
            >
                <SidebarOpen
                    className="sm:w-10 w-7 sm:h-10 h-7"
                    onClick={() => setSHow(!SHow)}
                />
            </span>
            <div className="flex items-center justify-between gap-2 bg-[#fafafa] border border-stone-300 py-1 px-2 mt-10 xl:mt-0">
                <div>اجمالي مبيعات السنة </div>
                <div className="text-pink-700 font-semibold">
                    {SalesData.currentYearSales}
                </div>
            </div>
            <div className="flex  items-center justify-between gap-2 bg-[#fafafa] border border-stone-300 py-1 px-2">
                <div className="">اجمالي مبيعات الشهر </div>
                <div className="text-pink-700 font-semibold">
                    {SalesData.currentMonthSales}
                </div>
            </div>
            <div className="h-full overflow-y-auto flex flex-col gap-2 relative">
                <div className="text-center text-lg font-bold text-sky-500 bg-white underline sticky top-0">
                    العملاء الاكثر نشاطاً
                </div>
                {SalesData.customersSales.map(
                    (customer: any, index: number) => (
                        <div
                            key={index + 1}
                            className="flex  items-center justify-between gap-2  border-b border-stone-300 py-1 px-2"
                        >
                            <div className="flex items-center gap-1">
                                <span className="text-pink-700 font-semibold">
                                    {index + 1}
                                </span>
                                <div className="">{customer.customerName}</div>
                            </div>
                            <div className="text-pink-700 font-semibold">
                                {customer.totalSales}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SalesOverView;

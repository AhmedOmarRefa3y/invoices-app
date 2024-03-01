"use client";
import { ViewIcon } from "lucide-react";
import React, { useState } from "react";
import { TbReportAnalytics } from "react-icons/tb";

interface SalesProps {
    SalesData: any;
}
const SalesOverView: React.FC<SalesProps> = ({ SalesData }) => {
    const [SHow, setSHow] = useState(false);
    return (
        <div
            className={`absolute xl:relative  xl:left-0 z-20 ${
                !SHow ? "-left-[300px]" : "left-0"
            }  w-[300px] xl:w-auto border top-0 bottom-0 bg-white p-2 flex flex-col gap-2 duration-300`}
        >
            <span className="absolute -right-8  xl:hidden ">
                <TbReportAnalytics
                    className="w-7 h-8"
                    onClick={() => setSHow(!SHow)}
                />
            </span>
            <div className="flex items-center justify-between gap-2 bg-[#fafafa] border border-stone-300 py-1 px-2">
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
            <div className="h-[60%] overflow-y-auto flex flex-col gap-2 relative">
                <div className="text-center text-lg font-bold text-sky-500 underline sticky top-0">
                    العملاء الاكثر نشاطاً
                </div>
                {SalesData.customersSales.map(
                    (customer: any, index: number) => (
                        <div className="flex  items-center justify-between gap-2  border-b border-stone-300 py-1 px-2">
                            <div className="flex items-center gap-1">
                                <span className="text-pink-700 font-semibold">{index + 1}</span>
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

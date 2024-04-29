"use client";
import { FileBarChart2, ViewIcon } from "lucide-react";
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
            <span className="absolute -right-10  xl:hidden ">
                <FileBarChart2
                    className="w-10 h-10"
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

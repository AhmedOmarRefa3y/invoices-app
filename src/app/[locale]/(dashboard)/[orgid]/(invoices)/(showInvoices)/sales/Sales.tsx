"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface SalesProps {
  SalesData: {
    currentYearSales: number;
    currentMonthSales: number;
    customersSales: Array<{
      customerName: string;
      totalSales: number;
    }>;
  };
}

const SalesOverView: React.FC<SalesProps> = ({ SalesData }) => {
  const t = useTranslations("salesOverview");

  return (
    <div className="bg-white h-full xl:left-0 z-50 w-[300px] border top-0 bottom-0 p-2 flex flex-col gap-2 duration-300 max-h-screen">
      <div className="flex items-center justify-between gap-2 bg-[#fafafa] border border-stone-300 py-1 px-2 mt-10 xl:mt-0">
        <div>{t("currentYearSales")}</div>
        <div className="text-pink-700 font-semibold">{SalesData.currentYearSales}</div>
      </div>
      <div className="flex items-center justify-between gap-2 bg-[#fafafa] border border-stone-300 py-1 px-2">
        <div>{t("thisMonthSales")}</div>
        <div className="text-pink-700 font-semibold">{SalesData.currentMonthSales}</div>
      </div>
      <div className="h-full overflow-y-auto flex flex-col gap-2 relative">
        <div className="text-center text-lg font-bold text-sky-500 bg-white underline sticky top-0">
          {t("mostActiveCustomers")}
        </div>
        {SalesData.customersSales.map((customer, index) => (
          <div
            key={index + 1}
            className="flex items-center justify-between gap-2 border-b border-stone-300 py-1 px-2"
          >
            <div className="flex items-center gap-1">
              <span className="text-pink-700 font-semibold">{index + 1}</span>
              <div>{customer.customerName}</div>
            </div>
            <div className="text-pink-700 font-semibold">{customer.totalSales}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesOverView;

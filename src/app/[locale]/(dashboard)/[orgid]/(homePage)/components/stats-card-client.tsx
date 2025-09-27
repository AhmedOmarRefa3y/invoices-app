"use client";

import { useTranslations } from "next-intl";

interface Stat {
  title: string;
  value: string;
  color: string;
  percentage: string;
  percentageColor: string;
  previousPeriod: string;
  currentPeriod: string;
}

const StatsCardClient = ({ stat }: { stat: Stat }) => {
  const t = useTranslations("statsCards");

  // Map titles to translation keys
  const getTitleKey = (title: string) => {
    switch (title) {
      case "مبيعات الشهر":
        return "monthSales";
      case "مبيعات السنة":
        return "yearSales";
      case "مدفوعات الشهر":
        return "monthPayments";
      case "رصيد العملاء":
        return "customerBalance";
      default:
        return title;
    }
  };

  const titleKey = getTitleKey(stat.title);
  const previousLabel = t("previous");

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 flex flex-col justify-center">
      <p className="text-gray-600 text-start text-lg font-bold mt-1">{t(titleKey)}</p>
      <div className="flex justify-between items-start">
        <h3 className={`text-xl font-bold ${stat.color}`}>{stat.value}</h3>
      </div>
      <span className={`text-sm ${stat.percentageColor}`}>{stat.percentage}</span>
      <div className=" text-xs text-gray-500 text-start">
        <p>{`${previousLabel} ${stat.previousPeriod}`}</p>
      </div>
    </div>
  );
};

export default StatsCardClient;

"use client";

import React, { useState } from "react";
import { Period } from "./top-customers-data";
import { useParams } from "next/navigation";

interface TopCustomersTableProps {
  initialData: {
    id: string;
    name: string;
    totalAmount: number;
    invoiceCount: number;
  }[];
  onPeriodChange: (period: Period) => Promise<any>;
  period: Period;
}

const TopCustomersTable = ({
  initialData,
  onPeriodChange,
  period: initialPeriod,
}: TopCustomersTableProps) => {
  const params = useParams();
  const locale = params.locale as string;
  const [data, setData] = useState(initialData);
  const [period, setPeriod] = useState(initialPeriod);
  const [loading, setLoading] = useState(false);

  const translations = {
    ar: {
      currentYear: "السنة الحالية",
      currentMonth: "الشهر الحالي",
      topCustomers: "العملاء الأكثر نشاطاً",
      rank: "الترتيب",
      customerName: "اسم العميل",
      invoiceCount: "عدد الفواتير",
      totalSales: "إجمالي المبيعات",
      loading: "جاري التحميل...",
      noData: "لا توجد بيانات",
      currency: "ج",
    },
    en: {
      currentYear: "Current Year",
      currentMonth: "Current Month",
      topCustomers: "Top Customers",
      rank: "Rank",
      customerName: "Customer Name",
      invoiceCount: "Invoice Count",
      totalSales: "Total Sales",
      loading: "Loading...",
      noData: "No data available",
      currency: "EGp",
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  const handlePeriodChange = async (newPeriod: Period) => {
    try {
      setLoading(true);
      setPeriod(newPeriod);
      const newData = await onPeriodChange(newPeriod);
      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <select
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value as Period)}
          className="px-3 py-1 border rounded-md text-sm"
          disabled={loading}
        >
          <option value="year">{t.currentYear}</option>
          <option value="month">{t.currentMonth}</option>
        </select>
        <h2 className="text-lg font-bold text-pink-500">{t.topCustomers}</h2>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full py-8">
            <div>{t.loading}</div>
          </div>
        ) : data && data.length > 0 ? (
          <table className="w-full divide-y divide-gray-200 text-right">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="px-2 py-1.5 text-xs font-semibold text-blue-500 text-center">
                  {t.rank}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-blue-500 text-center">
                  {t.customerName}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-blue-500 text-center">
                  {t.invoiceCount}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-blue-500 text-center">
                  {t.totalSales}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-2 py-1.5 text-center">
                    <span className="inline-block px-1.5 py-0.5 text-xs font-medium text-white bg-gray-500 rounded">
                      {(index + 1).toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center">{customer.name}</td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center">
                    {customer.invoiceCount.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                  </td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center">
                    {customer.totalAmount.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}{" "}
                    {t.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {locale === "ar" ? "لا توجد بيانات عملاء" : "No customer data yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {locale === "ar" 
                ? "ابدأ بتسجيل مبيعات لرؤية تحليل العملاء" 
                : "Start recording sales to see customer analytics"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCustomersTable;

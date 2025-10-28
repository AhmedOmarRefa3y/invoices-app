"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Period } from "@/app/[locale]/(dashboard)/[orgid]/(homePage)/data/top-products-data";

interface TopProduct {
  id: string;
  name: string;
  totalAmount: number;
  totalQuantity: number;
  invoiceCount: number;
  returnCount?: number;
  totalSalesAmount?: number;
  totalReturnsAmount?: number;
}

interface TopProductsTableProps {
  initialData: TopProduct[];
  period: Period;
  onPeriodChange: (period: Period) => Promise<TopProduct[]>;
}

export default function TopProductsTable({
  initialData,
  period: initialPeriod,
  onPeriodChange,
}: TopProductsTableProps) {
  const params = useParams();
  const locale = params.locale as string;
  const [data, setData] = useState(initialData);
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [loading, setLoading] = useState(false);

  const translations = {
    ar: {
      currentYear: "السنة الحالية",
      currentMonth: "الشهر الحالي",
      topProducts: "المنتجات الأكثر مبيعاً",
      product: "المنتج",
      quantity: "الكمية",
      amount: "القيمة",
      salesCount: "عدد المبيعات",
      loading: "جاري التحميل...",
      noData: "لا توجد بيانات",
      currency: "ج",
      order: "م",
    },
    en: {
      currentYear: "Current Year",
      currentMonth: "Current Month",
      topProducts: "Top Products",
      product: "Product",
      quantity: "Quantity",
      amount: "Amount",
      salesCount: "Sales Count",
      loading: "Loading...",
      noData: "No data available",
      currency: "EGP",
      order: "Order",
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
    <div className="w-full mx-auto  bg-white border border-stone-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 p-2">
        <h2 className="text-lg font-bold mx-3 text-blue-500">{t.topProducts}</h2>
        <select
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value as Period)}
          className="px-3 py-1 border rounded-md text-sm"
          disabled={loading}
        >
          <option value="year">{t.currentYear}</option>
          <option value="month">{t.currentMonth}</option>
        </select>
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
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">
                  {t.order}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">
                  {t.product}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">
                  {t.quantity}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">
                  {t.amount}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-2 py-1.5 text-xs font-medium text-center">{index + 1}</td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center ">{product.name}</td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center">
                    {product.totalQuantity.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                  </td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center whitespace-nowrap">
                    {product.totalAmount.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}{" "}
                    {t.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {locale === "ar" ? "لا توجد بيانات منتجات" : "No product data yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {locale === "ar"
                ? "ابدأ بتسجيل مبيعات لرؤية تحليل المنتجات"
                : "Start recording sales to see product analytics"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Period } from "./top-products-data";
import { useParams } from "next/navigation";

interface TopProduct {
  id: string;
  name: string;
  totalAmount: number;
  totalQuantity: number;
  invoiceCount: number;
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
    <div className="w-full me-auto p-2   h-full flex flex-col">
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
        <h2 className="text-lg font-bold mx-3 text-blue-500">{t.topProducts}</h2>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
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
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  {t.loading}
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((product, index) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  {t.noData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

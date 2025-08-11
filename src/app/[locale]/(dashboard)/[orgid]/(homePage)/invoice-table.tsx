"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";

interface InvoiceTableProps {
  initialInvoices: {
    id: string;
    number: number;
    date: Date;
    amount: number;
    customer?: {
      name: string;
    } | null;
  }[];
}

const InvoiceTable = ({ initialInvoices }: InvoiceTableProps) => {
  const params = useParams();
  const locale = params.locale as string;
  const orgid = params.orgid as string;

  const translations = {
    ar: {
      recentInvoices: "الفواتير الأخيرة",
      status: "الوضع",
      dueDate: "تاريخ الاستحقاق",
      invoiceNumber: "رقم الفاتورة",
      customer: "العميل",
      balance: "الرصيد",
      draft: "مسودة",
      viewAll: "تصفح الكل",
      currency: "ج",
    },
    en: {
      recentInvoices: "Recent Invoices",
      status: "Status",
      dueDate: "Due Date",
      invoiceNumber: "Invoice Number",
      customer: "Customer",
      balance: "Balance",
      draft: "Draft",
      viewAll: "View All",
      currency: "EGP",
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  return (
    <div className="w-full mx-auto  bg-white rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-right text-lg font-bold mb-3 p-2 text-orange-500">{t.recentInvoices}</h2>
      <div className="flex-1 overflow-y-auto min-h-0">
        {initialInvoices.length > 0 ? (
          <table className="w-full divide-y divide-gray-200 text-right">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">
                  {t.status}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">
                  {t.dueDate}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">
                  {t.invoiceNumber}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">
                  {t.customer}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">
                  {t.balance}
                </th>
                <th className="px-2 py-1.5 text-xs font-semibold text-gray-700 text-center">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {initialInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-2 py-1.5 text-center">
                    <span className="inline-block px-1.5 py-0.5 text-xs font-medium text-white bg-gray-500 rounded">
                      {t.draft}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center">
                    {new Date(invoice.date).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center">
                    INV{invoice.number.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                  </td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center">
                    {invoice.customer?.name || "-"}
                  </td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center whitespace-nowrap">
                    {invoice.amount.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}{" "}
                    {t.currency}
                  </td>
                  <td className="px-2 py-1.5 text-xs font-medium text-center">
                    <Link
                      href={`/${orgid}/sales/showInvoice/${invoice.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600"
                      title="View PDF"
                    >
                      📄
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {locale === "ar" ? "لا توجد فواتير" : "No invoices yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {locale === "ar"
                ? "ابدأ بإنشاء فاتورة جديدة"
                : "Get started by creating a new invoice"}
            </p>
            <Link
              href={`/${orgid}/add-sales-invoice`}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
            >
              {locale === "ar" ? "إنشاء فاتورة جديدة" : "Create New Invoice"}
            </Link>
          </div>
        )}
      </div>
      {initialInvoices.length > 0 && (
        <button className="mt-3 px-4 mr-2 mb-2 py-1.5 text-xs bg-black text-white font-medium rounded hover:bg-gray-800 transition w-fit">
          {t.viewAll}
        </button>
      )}
    </div>
  );
};

export default InvoiceTable;

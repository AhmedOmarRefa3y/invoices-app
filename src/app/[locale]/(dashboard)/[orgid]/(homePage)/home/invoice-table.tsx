import React from "react";
import prismaDb from "@/lib/prisma";

interface InvoiceTableProps {
  orgid: string;
}

const InvoiceTable = async ({ orgid }: InvoiceTableProps) => {
  // Fetch the latest 5 invoices for the organization
  const invoices = await prismaDb.invoice.findMany({
    where: { organizationId: orgid },
    include: { customer: true },
    orderBy: { date: "desc" },
    take: 5,
  });

  return (
    <div className="w-1/2 mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-right text-xl font-bold mb-4">الفواتير الأخيرة</h2>
      <table className="min-w-full divide-y divide-gray-200 text-right">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-sm font-semibold text-gray-700">PDF</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700">الرصيد</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700">العميل</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700">رقم الفاتورة</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700">تاريخ الاستحقاق</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700">الوضع</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">📄</td>
              <td className="px-4 py-2">{invoice.amount} EGP</td>
              <td className="px-4 py-2">{invoice.customer?.name || "-"}</td>
              <td className="px-4 py-2">INV{invoice.number}</td>
              <td className="px-4 py-2">
                {new Date(invoice.date).toLocaleDateString("ar-EG")}
              </td>
              <td className="px-4 py-2">
                <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-gray-500 rounded">
                  مسودة
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition">
        تصفح الكل
      </button>
    </div>
  );
};

export default InvoiceTable;

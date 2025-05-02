"use client";
import { EditInvoiceT } from "@/components/ui/editInvoiceBtn";
import { Prisma } from "@prisma/client";
import React from "react";

import InvoiceComp from "@/components/InvoiceComp";
import { useTranslations } from "use-intl";

interface InvoiceBodyProps {
  invoiceData: invoice | null;
}

type invoice = Prisma.InvoiceGetPayload<{
  include: {
    customer: true;
    orders: {
      include: {
        Product: true;
      };
    };
    payment: true;
  };
}>;

const InvoiceBody: React.FC<InvoiceBodyProps> = ({ invoiceData }) => {
  const t = useTranslations("invoice");
  const EditInvoiceD: EditInvoiceT | null = invoiceData
    ? {
        CreatedAt: invoiceData.createdAt,
        customer: invoiceData.customer,
        customerName: invoiceData.customer.name,
        date: invoiceData.date,
        id: invoiceData.id,
        Items: invoiceData.orders.map((item) => {
          return item;
        }),
        number: invoiceData.number,
        PaidAmount: invoiceData.payment?.amount as number,
      }
    : null;

  return (
    <InvoiceComp
      EditInvoiceD={EditInvoiceD}
      InvoiceData={invoiceData}
      label={t("salesInvoice")}
      type="sales"
    />
  );
};

export default InvoiceBody;

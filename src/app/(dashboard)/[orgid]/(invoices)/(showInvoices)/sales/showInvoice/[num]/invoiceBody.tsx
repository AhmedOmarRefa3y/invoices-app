"use client";
import { EditInvoiceT } from "@/components/ui/editInvoiceBtn";
import { Prisma } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React, { useRef } from "react";

import InvoiceComp from "@/components/InvoiceComp";

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
    const searchParams = useSearchParams();
    const num: number = parseInt(searchParams.get("num") || "1");

    // const curruntInvoice: invoice | undefined = invoices.find(
    //     (invoice) => invoice.number === num
    // );

    // const curruntInvoiceIndex = invoices.findIndex(
    //     (item) => item.number === curruntInvoice?.number
    // );

    // const PerviousInvoice = invoices[curruntInvoiceIndex - 1]?.number;
    // const nextInvoice = invoices[curruntInvoiceIndex + 1]?.number;

    let EditInvoiceD: EditInvoiceT | null = invoiceData
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
            curruntInvoice={invoiceData}
            num={num}
            label="فاتورة مبيعات"
            type="sales"
        />
    );
};

export default InvoiceBody;

"use client";
import InvoiceHeader from "@/components/InvoiceHeader";
import { Button } from "@/components/ui/button";
import EditInvoiceBtn, { EditInvoiceT } from "@/components/ui/editInvoiceBtn";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import { ArrowBigLeft, ArrowBigRight, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import InvoiceComp from "@/components/InvoiceComp";

interface InvoiceBodyProps {
    invoices: invoice[];
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

const InvoiceBody: React.FC<InvoiceBodyProps> = ({ invoices }) => {
    const searchParams = useSearchParams();
    const num: number = parseInt(searchParams.get("num") || "1");

    const curruntInvoice: invoice | undefined = invoices.find(
        (invoice) => invoice.number === num
    );
    const componentRef = useRef(null);

    const curruntInvoiceIndex = invoices.findIndex(
        (item) => item.number === curruntInvoice?.number
    );

    const PerviousInvoice = invoices[curruntInvoiceIndex - 1]?.number;
    const nextInvoice = invoices[curruntInvoiceIndex + 1]?.number;

    let EditInvoiceD: EditInvoiceT | null = curruntInvoice
        ? {
              CreatedAt: curruntInvoice.createdAt,
              customer: curruntInvoice.customer,
              customerName: curruntInvoice.customer.name,
              date: curruntInvoice.date,
              id: curruntInvoice.id,
              Items: curruntInvoice.orders.map((item) => {
                  return item;
              }),
              number: curruntInvoice.number,
              PaidAmount: curruntInvoice.payment?.amount as number,
          }
        : null;

    return (
        <InvoiceComp
            EditInvoiceD={EditInvoiceD}
            invoices={invoices}
            PerviousInvoice={PerviousInvoice}
            nextInvoice={nextInvoice}
            curruntInvoice={curruntInvoice}
            num={num}
            componentRef={componentRef}
            label="فاتورة مبيعات"
            type="sales"
        />
    );
};

export default InvoiceBody;

"use client";
import InvoiceHeader from "@/components/InvoiceHeader";
import { Button } from "@/components/ui/button";
import EditInvoiceBtn, { EditInvoiceT } from "@/components/ui/editInvoiceBtn";
import { Prisma } from "@prisma/client";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import React, { useRef } from "react";
import { ArrowBigLeft, ArrowBigRight, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import InvoiceComp from "./InvoiceComp";
import { useSearchParams } from "next/navigation";

interface PurchInvoiceBodyProps {
  invoices: PurchInvoice[];
}

type PurchInvoice = Prisma.PurchaseInvoiceGetPayload<{
  include: {
    Supplier: true;
    lineItems: {
      include: {
        product: true;
      };
    };
  };
}>;

const PurchInvoiceBody: React.FC<PurchInvoiceBodyProps> = ({ invoices }) => {
  const searchParams = useSearchParams();
  const num: number = parseInt(searchParams.get("num") || "1");

  const curruntInvoice: PurchInvoice | undefined = invoices.find(
    (invoice) => invoice.number === num
  );
  const componentRef = useRef(null);

  const curruntInvoiceIndex = invoices.findIndex((item) => item.number === curruntInvoice?.number);

  const PerviousInvoice = invoices[curruntInvoiceIndex - 1]?.number;
  const nextInvoice = invoices[curruntInvoiceIndex + 1]?.number;

  // let EditInvoiceD: EditInvoiceT | null = curruntInvoice
  //     ? {
  //           CreatedAt: curruntInvoice.createdAt,
  //           customer: curruntInvoice.Supplier,
  //           customerName: curruntInvoice.Supplier.name,
  //           date: curruntInvoice.date,
  //           id: curruntInvoice.id,
  //           Items: curruntInvoice.lineItems.map((item) => {
  //               return item;
  //           }),
  //           number: curruntInvoice.number,
  //       }
  //     : null;

  return (
    <InvoiceComp
      invoices={invoices}
      PerviousInvoice={PerviousInvoice}
      nextInvoice={nextInvoice}
      curruntInvoice={curruntInvoice}
      num={num}
      componentRef={componentRef}
      label="Purchase Invoice"
    />
  );
};

export default PurchInvoiceBody;

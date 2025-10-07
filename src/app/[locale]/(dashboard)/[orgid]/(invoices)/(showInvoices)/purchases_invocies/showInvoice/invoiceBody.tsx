"use client";
import { Prisma } from "@prisma/client";
import React, { useRef } from "react";
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

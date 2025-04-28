"use client";
import { Prisma } from "@prisma/client";
import React from "react";
import InvoiceComp from "@/components/InvoiceComp";

interface InvoiceBodyProps {
  invoiceData: invoice | null;
}

type invoice = Prisma.ReturnedInvoiceGetPayload<{
  include: {
    customer: true;
    orders: {
      include: {
        Product: true;
      };
    };
  };
}>;

const RETinvoiceBody: React.FC<InvoiceBodyProps> = ({ invoiceData }) => {
  return (
    <InvoiceComp
      label="Returns Invoice"
      EditInvoiceD={null}
      InvoiceData={invoiceData}
      type="returns"
    />
  );
};

export default RETinvoiceBody;

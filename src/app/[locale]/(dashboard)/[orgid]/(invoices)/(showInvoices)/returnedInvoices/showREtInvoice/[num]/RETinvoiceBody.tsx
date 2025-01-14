"use client";
import { Prisma } from "@prisma/client";
import { useRouter, useSearchParams } from "@/i18n/routing";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoiceHeader from "@/components/InvoiceHeader";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
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

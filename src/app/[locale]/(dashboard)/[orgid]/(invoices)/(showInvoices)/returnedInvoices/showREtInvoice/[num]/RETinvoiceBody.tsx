"use client";
import { Prisma } from "@prisma/client";
import React from "react";
import InvoiceComp from "@/components/InvoiceComp";
import { useTranslations } from "use-intl";

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
  const t = useTranslations("Returns");
  return (
    <InvoiceComp
      label={t("returnsInvoice")}
      EditInvoiceD={null}
      InvoiceData={invoiceData}
      type="returns"
    />
  );
};

export default RETinvoiceBody;

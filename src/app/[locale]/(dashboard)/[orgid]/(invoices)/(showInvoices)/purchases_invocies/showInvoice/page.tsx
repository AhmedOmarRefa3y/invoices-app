import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./invoiceBody";

const InvoicePage = async ({ params }: { params: { orgid: string } }) => {
  const invoices = await prismaDb.purchaseInvoice.findMany({
    where: {
      organizationId: params.orgid,
    },
    include: {
      Supplier: true,
      lineItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      number: "asc",
    },
  });

  return <InvoiceBody invoices={invoices} />;
};

export default InvoicePage;

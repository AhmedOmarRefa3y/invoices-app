import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./invoiceBody";

const InvoicePage = async ({ params }: { params: Promise<{ orgid: string; num: string }> }) => {
  const GetInvoice = await prismaDb.invoice.findFirst({
    where: {
      organizationId: (await params).orgid,
      number: parseInt((await params).num as string),
    },
    include: {
      customer: true,
      orders: {
        include: {
          Product: true,
        },
      },
      payment: true,
    },
    orderBy: {
      number: "asc",
    },
  });

  return <InvoiceBody invoiceData={GetInvoice} />;
};

export default InvoicePage;

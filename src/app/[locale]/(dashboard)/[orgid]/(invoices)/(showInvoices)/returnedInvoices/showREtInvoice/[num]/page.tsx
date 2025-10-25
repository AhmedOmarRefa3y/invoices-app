import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./RETinvoiceBody";

const InvoicePage = async ({ params }: { params: Promise<{ orgid: string; num: string }> }) => {
  const GetInvoice = await prismaDb.returnedInvoice.findFirst({
    where: {
      organizationId: (await params).orgid,
      number: parseInt((await params).num),
    },
    include: {
      customer: true,
      orders: {
        include: {
          Product: true,
        },
      },
    },
    orderBy: {
      number: "asc",
    },
  });

  return <InvoiceBody invoiceData={GetInvoice} />;
};

export default InvoicePage;

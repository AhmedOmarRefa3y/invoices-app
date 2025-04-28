import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./invoiceBody";

const InvoicePage = async ({ params }: { params: { orgid: string; num: string } }) => {
  console.log(params);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  const GetInvoice = await prismaDb.invoice.findFirst({
    where: {
      organizationId: params.orgid,
      number: parseInt(params.num as string),
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

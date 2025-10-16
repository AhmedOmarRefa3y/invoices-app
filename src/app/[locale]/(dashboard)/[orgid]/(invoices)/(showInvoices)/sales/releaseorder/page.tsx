import prismaDb from "@/lib/prisma";
import React from "react";
import InvoiceBody from "./releaseBody";

const InvoicePage = async ({ params }: { params: { orgid: string } }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Fetching invoices for org:", params.orgid);

  const invoices = await prismaDb.invoice.findMany({
    where: {
      organizationId: params.orgid,
    },
    include: {
      customer: true,
      lineItems: {
        include: {
          product: {
            include: {
              unit: true,
            },
          },
        },
        orderBy: {
          ItemNumber: "asc",
        },
      },
      payment: true,
    },
    orderBy: {
      number: "asc",
    },
  });

  return <InvoiceBody invoices={invoices} />;
};

export default InvoicePage;

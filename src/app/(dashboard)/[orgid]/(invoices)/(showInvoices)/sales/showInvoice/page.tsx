import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./invoiceBody";

const InvoicePage = async ({ params }: { params: { orgid: string } }) => {
    const invoices = await prismaDb.invoice.findMany({
        where: {
            organizationId: params.orgid,
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

    return <InvoiceBody invoices={invoices} />;
};

export default InvoicePage;

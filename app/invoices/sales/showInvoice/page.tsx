import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./invoiceBody";

const InvoicePage = async () => {
    const invoices = await prismaDb.invoice.findMany({
        include: {
            customer: true,
            orders: {
                include: {
                    Product: true,
                    ProductPackage: true,
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

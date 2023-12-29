import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./invoiceBody";

const InvoicePage = async () => {
    const invoices = await prismaDb.invoice.findMany({
        include: {
            customer: true,
            lineItems: {
                include: {
                    product: {
                        include: {
                            Parts: {
                                include: {
                                    product: {
                                        include: {
                                            unit: true,
                                        },
                                    },
                                },
                            },
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

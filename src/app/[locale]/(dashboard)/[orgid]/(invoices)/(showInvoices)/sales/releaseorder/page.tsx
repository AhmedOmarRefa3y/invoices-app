import prismaDb from "@/lib/prisma";
import React from "react";
import InvoiceBody from "./releaseBody";

const InvoicePage = async ({ params }: { params: { orgid: string } }) => {
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

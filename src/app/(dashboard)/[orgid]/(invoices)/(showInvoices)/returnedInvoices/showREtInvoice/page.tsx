import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./RETinvoiceBody";

const InvoicePage = async ({ params }: { params: { orgid: string } }) => {
    const RETinvoices = await prismaDb.returnedInvoice.findMany({
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
        },
        orderBy: {
            number: "asc",
        },
    });

    return <InvoiceBody invoices={RETinvoices} />;
};

export default InvoicePage;

import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./RETinvoiceBody";

interface InvoicePageProps {
    searchParams: {
        num: string;
        dec: string;
    };
}

const InvoicePage: React.FC<InvoicePageProps> = async () => {
    const RETinvoices = await prismaDb.returnedInvoice.findMany({
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
    // console.log(RETinvoices);

    return (
        <>
            <InvoiceBody invoices={RETinvoices} />
        </>
    );
};

export default InvoicePage;

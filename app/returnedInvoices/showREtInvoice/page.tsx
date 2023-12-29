import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./RETinvoiceBody";


interface InvoicePageProps {
    searchParams: {
        num: string;
        dec: string;
    };
}

const InvoicePage: React.FC<InvoicePageProps> = async ({ searchParams }) => {
    const RETinvoices = await prismaDb.returnedInvoice.findMany({
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
            },
        },
        orderBy: {
            number: "asc",
        },
    });
    console.log(RETinvoices);

    return (
        <>
            <InvoiceBody invoices={RETinvoices} />
        </>
    );
};

export default InvoicePage;

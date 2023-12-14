import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./RETinvoiceBody";
import Refetch from "@/components/refetch";

interface InvoicePageProps {
    searchParams: {
        num: string;
        dec: string;
    };
}

export const dynamic = "force-dynamic";

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
            <Refetch />
            <InvoiceBody invoices={RETinvoices} />
        </>
    );
};

export default InvoicePage;

import prismaDb from "@/lib/prisma";
import React from "react";

import InvoiceBody from "./invoiceBody";
import Refetch from "@/components/refetch";

interface InvoicePageProps {
    searchParams: {
        num: string;
        dec: string;
    };
}

export const dynamic = "force-dynamic";

const InvoicePage: React.FC<InvoicePageProps> = async ({ searchParams }) => {
    // console.log(searchParams);

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
            },
            payment: true,
        },
        orderBy: {
            number: "asc",
        },
    });

    // console.log(invoices);

    return (
        <>
            <Refetch />
            <InvoiceBody invoices={invoices} />;
        </>
    );
};

export default InvoicePage;

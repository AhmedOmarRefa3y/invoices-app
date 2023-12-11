import prismaDb from "@/lib/prisma";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoiceBody from "./releaseBody";
import { redirect } from "next/navigation";

interface InvoicePageProps {
    searchParams: {
        num: string;
        dec: string;
    };
    params: {
        slug: string;
    };
}

export const dynamic = "force-dynamic";

const InvoicePage: React.FC<InvoicePageProps> = async ({
    searchParams,
    params,
}) => {
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
                            unit: true,
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

    return <InvoiceBody invoices={invoices} />;
};

export default InvoicePage;

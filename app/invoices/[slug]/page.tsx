import prismaDb from "@/lib/prisma";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoiceBody from "./invoiceBody";

interface InvoicePageProps {
    searchParams: {
        num: string;
    };
    params: {
        slug: string;
    };
}

const InvoicePage: React.FC<InvoicePageProps> = async ({
    searchParams,
    params,
}) => {
    console.log(searchParams);
    const data = await prismaDb.invoice.findFirst({
        where: {
            // id: params.slug,
            number: parseInt(searchParams.num),
        },
        include: {
            customer: true,
            lineItems: {
                include: {
                    product: {
                        include: {
                            Parts: true,
                        },
                    },
                },
            },
            payment: true,
        },
    });
    if (!data) {
        const data = await prismaDb.invoice.findFirst({
            where: {
                // id: params.slug,
                number: parseInt(searchParams.num),
            },
            include: {
                customer: true,
                lineItems: {
                    include: {
                        product: {
                            include: {
                                Parts: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
    }

    return <InvoiceBody data={data} />;
};

export default InvoicePage;

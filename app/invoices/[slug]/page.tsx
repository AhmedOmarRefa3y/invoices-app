import prismaDb from "@/lib/prisma";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoiceBody from "./invoiceBody";

interface InvoicePageProps {
    params: {
        slug: string;
    };
}

const InvoicePage: React.FC<InvoicePageProps> = async ({ params }) => {
    const data = await prismaDb.invoice.findFirst({
        where: {
            id: params.slug,
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

    return <InvoiceBody data={data} />;
};

export default InvoicePage;

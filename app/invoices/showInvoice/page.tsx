import prismaDb from "@/lib/prisma";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoiceBody from "./invoiceBody";
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

const InvoicePage: React.FC<InvoicePageProps> = async ({
    searchParams,
    params,
}) => {
    console.log(searchParams);
    // const data = await prismaDb.invoice.findFirst({
    //     where: {
    //         // id: params.slug,
    //         number: parseInt(searchParams.num),
    //     },
    //     include: {
    //         customer: true,
    //         lineItems: {
    //             include: {
    //                 product: {
    //                     include: {
    //                         Parts: true,
    //                     },
    //                 },
    //             },
    //         },
    //         payment: true,
    //     },
    // });

    

    let data;
    const fetchInvoiceData = async (invoiceNumber: number) => {
        try {
            data = await prismaDb.invoice.findFirst({
                where: {
                    // id: params.slug,
                    number: invoiceNumber,
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
            if (data) {
                return data;
            }
            return null;
        } catch (error) {
            console.error("Error fetching invoice data:", error);
            return null;
        }
    };
    await fetchInvoiceData(parseInt(searchParams.num));

    let attempsNumber = 100;

    const findNextExistingInvoice = async (
        invoiceNumber: number,
        increment: number
    ) => {
        const nextInvoiceNumber =
            searchParams.dec === "true"
                ? invoiceNumber - increment
                : invoiceNumber + increment;
        const nextInvoiceData = await fetchInvoiceData(nextInvoiceNumber);

        console.log(nextInvoiceNumber);

        if (nextInvoiceData) {
            redirect(
                `?num=${nextInvoiceData.number}${
                    searchParams.dec === "true" ? "&dec=true" : ""
                }`
            );
        } else {
            attempsNumber = attempsNumber - 1;

            if (attempsNumber > 0) {
                await findNextExistingInvoice(nextInvoiceNumber, increment);
            }
        }
    };
    if (!data) {
        await findNextExistingInvoice(parseInt(searchParams.num), 1);
    }
    console.log(data);

    return <InvoiceBody data={data} />;
};

export default InvoicePage;

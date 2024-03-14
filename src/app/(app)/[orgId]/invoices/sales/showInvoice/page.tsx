import prismaDb from "@/lib/prisma";
import React from "react";
import { Mada } from "next/font/google";

const inter = Mada({ subsets: ["arabic"], weight: "400" });
import InvoiceBody from "./invoiceBody";

const InvoicePage = async () => {
    const invoices = await prismaDb.invoice.findMany({
        include: {
            customer: true,
            orders: {
                include: {
                    Product: true,
                    ProductPackage: true,
                },
            },
            payment: true,
        },
        orderBy: {
            number: "asc",
        },
    });

    return (
        <div className={`${inter.className} `}>
            <InvoiceBody invoices={invoices} />;
        </div>
    );
};

export default InvoicePage;

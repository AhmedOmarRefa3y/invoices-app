import Daisytable from "@/components/Daisytable";
import prismaDb from "@/lib/prisma";
import React from "react";

const page = async () => {
    const invoices = await prismaDb.invoice.findMany({
        include: {
            customer: true,
            lineItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    const formattedInvoices = invoices.map((item) => {
        return {
            id: item.id,
            customerName: item.customer.name,
            date: item.date,
            number: item.number,
            products: item.lineItems.map((item) => {
                return {
                    id: item.product.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                };
            }),
        };
    });
    return (
        <div>
            <Daisytable inovices={formattedInvoices} />
        </div>
    );
};

export default page;

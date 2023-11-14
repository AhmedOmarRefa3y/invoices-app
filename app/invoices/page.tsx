import InvoicesTable from "@/components/InvoicesTable";
import prismaDb from "@/lib/prisma";
import React from "react";

const ShowInvoices = async () => {
    const invoices = await prismaDb.invoice.findMany({
        include: {
            customer: true,
            lineItems: {
                include: {
                    product: true,
                },
            },
            payment: true,
        },
        orderBy: {
            number: "desc",
        },
    });

    const formattedInvoices = invoices.map((item) => {
        return {
            id: item.id,
            customerName: item.customer.name,
            customerId: item.customerId,
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
            paidAmount: item.payment?.amount,
            createdAt: item.createdAt,
        };
    });
    return (
        <div className="bg-gray-50 border-gray-200 border mt-3 rounded-md bg-opacity-90 relative">
            <InvoicesTable inovices={formattedInvoices} />
        </div>
    );
};

export default ShowInvoices;

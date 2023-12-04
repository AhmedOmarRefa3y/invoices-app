import React from "react";
import InvoiceTable from "./InvoiceTable";
import prismaDb from "@/lib/prisma";
import AddInvoiceFrom from "./Invoice";

const page = async () => {
    const customers = await prismaDb.customer.findMany({
        include: {
            invoices: {
                include: {
                    lineItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
            Payment: true,
        },
    });
    const products = await prismaDb.product.findMany({
        orderBy: {
            name: "asc",
        },
    });
    const formattedCustomers = customers.map((customer) => {
        let InvoiceTotal = 0;
        customer.invoices.forEach((invoice) => {
            invoice.lineItems.forEach((lineItem) => {
                InvoiceTotal =
                    InvoiceTotal + lineItem.quantity * lineItem.product.price;
            });
        });
        let TotalPayments = 0;
        customer.Payment.forEach((payment) => {
            TotalPayments = TotalPayments + payment.amount;
        });
        return {
            id: customer.id,
            name: customer.name,
            TotalPayments: TotalPayments,
            InvoiceTotal: InvoiceTotal,
        };
    });
    return (
        <AddInvoiceFrom
            products={products}
            customers={customers}
            customersBalannces={formattedCustomers}
        />
    );
};

export default page;

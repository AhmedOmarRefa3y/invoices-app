import React from "react";
import InvoiceTable from "./components/InvoiceTable";
import prismaDb from "@/lib/prisma";
import AddInvoiceFrom from "./AddInvoicePage";
import AddInvoicePage from "./AddInvoicePage";

const page = async () => {
    const customers = await prismaDb.customer.findMany({
        include: {
            invoices: {
                include: {
                    lineItems: {
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
            Payment: true,
        },
    });
    const products = await prismaDb.product.findMany({
        orderBy: {
            name: "asc",
        },
        include: {
            Inventory: true,
            Parts: true,
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
        <AddInvoicePage
            products={products}
            customers={customers}
            customersBalannces={formattedCustomers}
        />
    );
};

export default page;

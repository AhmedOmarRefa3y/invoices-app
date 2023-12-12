import React from "react";
import InvoiceTable from "./components/InvoiceTable";
import prismaDb from "@/lib/prisma";
import AddInvoiceFrom from "./AddInvoicePage";
import AddInvoicePage from "./AddInvoicePage";
import Rendreing from "./rendreing";
import Refetch from "@/components/refetch";

export const dynamic = "force-dynamic";

const page = async () => {
    const customers = await prismaDb.customer.findMany({
        include: {
            invoices: true,
            Payment: true,
            ReturnedInvoice: true,
        },
    });
    const products = await prismaDb.product.findMany({
        include: {
            Inventory: true,
            Parts: true,
        },
        orderBy: {
            name: "asc",
        },
    });
    const formattedCustomers = customers.map((customer) => {
        let InvoiceTotal = 0;
        customer.invoices.forEach((invoice) => {
            InvoiceTotal += invoice.amount;
        });
        let TotalPayments = 0;
        customer.Payment.forEach((payment) => {
            TotalPayments += payment.amount;
        });
        let REtInvTotal = 0;
        customer.ReturnedInvoice.forEach((REtInv) => {
            REtInvTotal += REtInv.amount;
        });

        return {
            id: customer.id,
            name: customer.name,
            TotalPayments,
            InvoiceTotal,
            REtInvTotal,
            Currbalance: InvoiceTotal - (TotalPayments + REtInvTotal),
        };
    });
    return (
        <>
            <Refetch />
            <Rendreing
                products={products}
                customers={customers}
                customersBalannces={formattedCustomers}
            />
        </>
    );
};

export default page;

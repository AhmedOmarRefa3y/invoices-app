import Refetch from "@/components/refetch";
import prismaDb from "@/lib/prisma";

import ReturnedInvoicePage from "./ReturnedInvoicePage";

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
            <ReturnedInvoicePage products={products} customers={customers} />
        </>
    );
};

export default page;

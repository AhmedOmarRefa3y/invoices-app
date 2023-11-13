import AddInvoiceFrom from "@/components/addInvoice/AddInvoiceFrom";
import prismaDb from "@/lib/prisma";

export default async function Home() {
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
    const products = await prismaDb.product.findMany();
    const formattedCustomers = customers.map((customer) => {
        let InvoiceTotal = 0;
        customer.invoices.map((invoice) => {
            invoice.lineItems.map((lineItem) => {
                InvoiceTotal =
                    InvoiceTotal + lineItem.quantity * lineItem.product.price;
            });
        });
        let TotalPayments = 0;
        customer.Payment.map((payment) => {
            TotalPayments = TotalPayments + payment.amount;
        });
        return {
            id: customer.id,
            name: customer.name,
            TotalPayments,
            InvoiceTotal,
        };
    });
    return (
        <main className="flex min-h-screen flex-col items-center justify-between ">
            <AddInvoiceFrom
                customersBalannces={formattedCustomers}
                customers={customers}
                products={products}
            />
        </main>
    );
}

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
    console.log(products);

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

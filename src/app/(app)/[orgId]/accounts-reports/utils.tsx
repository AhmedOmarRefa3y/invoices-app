import prismaDb from "@/lib/prisma";

export const GetCustomersBalances = async () => {
    const customers = await prismaDb.customer.findMany({
        include: {
            invoices: {
                include: {
                    lineItems: true,
                },
            },
            Payment: true,
            ReturnedInvoice: {
                include: {
                    lineItems: true,
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    const CustomersBalance = customers.map((customer) => {
        let TotalInvoicesAmount = 0;
        let TotalRetInvoicesAmount = 0;
        let Totalpayments = 0;

        customer.invoices.map((invoice) => {
            TotalInvoicesAmount += invoice.amount;
        });

        customer.Payment.map((payment) => {
            Totalpayments += payment.amount;
        });
        customer.ReturnedInvoice.map((RetInvoice) => {
            TotalRetInvoicesAmount += RetInvoice.amount;
        });

        let itemsNumber = 0;
        customer.invoices.forEach((item) => {
            item.lineItems.forEach((item) => {
                itemsNumber += 1;
            });
        });
        return {
            id: customer.id,
            name: customer.name,
            CustomerCredit: customer.CustomerCredit,
            customerRecordsNumber:
                customer.Payment.length +
                customer.ReturnedInvoice.length +
                customer.invoices.length,
            customerRecordsNumberWithitems:
                customer.Payment.length +
                customer.ReturnedInvoice.length +
                itemsNumber,
            CustomerTotalDebit: TotalInvoicesAmount,
            CustomerTotalCredit: Totalpayments + TotalRetInvoicesAmount,
            TotalInvoicesAmount,
            Totalpayments,
            TotalRetInvoicesAmount,
            currntBalance:
                TotalInvoicesAmount -
                (Totalpayments + TotalRetInvoicesAmount) +
                customer.CustomerCredit,
        };
    });
    return CustomersBalance;
};

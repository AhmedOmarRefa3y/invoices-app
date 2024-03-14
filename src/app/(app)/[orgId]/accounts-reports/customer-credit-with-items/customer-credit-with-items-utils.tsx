import prismaDb from "@/lib/prisma";
interface searchParamsT {
    customerid: string;
    ltdate: string;
    gtdate: string;
    Debit: string;
    Credit: string;
    items: string;
}

export const GetCustomerRecordsWithITems = async (
    searchParams: searchParamsT
) => {
    const customers = await prismaDb.customer.findMany({});

    const fromDate = searchParams.gtdate
        ? new Date(searchParams.gtdate).toISOString()
        : undefined;
    const toDate = searchParams.ltdate
        ? new Date(searchParams.ltdate).toISOString()
        : undefined;

    const customer = await prismaDb.customer.findFirst({
        where: {
            id: searchParams.customerid,
        },
        include: {
            invoices: {
                where: {
                    date: {
                        gt: fromDate,
                        lt: toDate,
                    },
                },
                include: {
                    orders: {
                        include: {
                            Product: true,
                            Invoice: true,
                            ProductPackage: true,
                        },
                    },
                },
                orderBy: {
                    date: "asc",
                },
            },
            ReturnedInvoice: {
                where: {
                    date: {
                        gt: fromDate,
                        lt: toDate,
                    },
                },
            },
            Payment: {
                where: {
                    date: {
                        gt: fromDate,
                        lt: toDate,
                    },
                },
            },
        },
    });

    const CustomerItemsAndPayments: {
        type: string;
        amount: number;
        itemName?: string;
        ItemQuantity?: number;
        ItemPrice?: number;
        date?: Date;
        number?: number;
        kind?: string;
    }[] = [];

    if (customer) {
        if (searchParams.Debit === "true") {
            customer.invoices.map((item) => {
                item.orders.map((item) => {
                    CustomerItemsAndPayments.push({
                        type: "debit",
                        itemName: item.Product
                            ? item.Product.name
                            : item.ProductPackage?.name,
                        ItemQuantity: item.quantity,
                        ItemPrice: item.price,
                        amount: item.amount,
                        date: item.Invoice?.date,
                    });
                });
            });
        }
        if (searchParams.Credit === "true") {
            customer.Payment.map((item) => {
                CustomerItemsAndPayments.push({
                    type: "credit",
                    kind: item.method,
                    amount: item.amount,
                    date: item.date,
                });
            });
            customer.ReturnedInvoice.map((item) => {
                CustomerItemsAndPayments.push({
                    type: "credit",
                    kind: "مرتجع",
                    amount: item.amount,
                    date: item.createdAt,
                });
            });
        }
        customer.CustomerCredit
            ? CustomerItemsAndPayments.push({
                  type: "openCredit",
                  amount: customer.CustomerCredit,
                  kind: "openCredit",
              })
            : null;
        CustomerItemsAndPayments.sort((a, b) => {
            const dateA = a.date?.getTime() || 0;
            const dateB = b.date?.getTime() || 0;

            return dateA - dateB;
        });
    }
    // console.log(CustomerItemsAndPayments);

    return {
        customers,
        CustomerItemsAndPayments,
    };
};

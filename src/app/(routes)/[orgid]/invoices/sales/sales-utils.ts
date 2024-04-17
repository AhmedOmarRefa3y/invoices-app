import prismaDb from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { invoiceTableT } from "./columns";
import { endOfYear, lastDayOfMonth, startOfMonth, startOfYear } from "date-fns";

type LineItem = Prisma.LineItemGetPayload<{
    include: {
        invoice: true;
        product: true;
    };
}>;
type customer = Prisma.CustomerGetPayload<{
    include: {
        Payment: true;
    };
}>;

interface invoice {
    id: string;
    number: number;
    customerName: string;
    Items: LineItem[];
    date: Date;
    PaidAmount: number;
    CreatedAt: Date;
    customer: customer;
    amount: number;
}
export async function GetSalesInvoices(ORG_ID: string) {
    // console.log(ORG_ID);
    const invoices = await prismaDb.invoice.findMany({
        where: {
            organizationId: ORG_ID,
        },
        include: {
            customer: {
                include: {
                    Payment: true,
                },
            },
            orders: {
                include: {
                    Product: true,
                },
            },
            // lineItems: {
            //     include: {
            //         invoice: true,
            //         product: true,
            //     },
            // },
            payment: true,
        },
        orderBy: {
            date: "desc",
        },
    });

    // current Month Sales
    const start = startOfMonth(new Date());
    const lastDay = lastDayOfMonth(new Date());

    const currentMonthSales = invoices
        .filter((item) => item.date >= start && item.date <= lastDay)
        .reduce((a, b) => a + b.amount, 0);
    const currentYearSales = invoices
        .filter(
            (item) =>
                item.date >= startOfYear(new Date()) &&
                item.date <= endOfYear(new Date())
        )
        .reduce((a, b) => a + b.amount, 0);

    // console.log(currentYearSales);

    async function getCustomerSales() {
        const customers = await prismaDb.customer.findMany({
            where: {
                organizationId: ORG_ID,
            },
            include: {
                invoices: {
                    where: {
                        date: {
                            gte: startOfYear(new Date()),
                            lte: endOfYear(new Date()),
                        },
                        organizationId: ORG_ID,
                    },
                },
            },
        });

        const customerSales = customers
            .map((customer) => {
                const totalInvoiceAmount = customer.invoices.reduce(
                    (total, invoice) => total + invoice.amount,
                    0
                );

                const totalSales = totalInvoiceAmount;

                return {
                    customerId: customer.id,
                    customerName: customer.name,
                    totalSales,
                };
            })
            .sort((a, b) => b.totalSales - a.totalSales);

        return customerSales;
    }

    const customersSales = await getCustomerSales();
    // console.log(customersSales);

    const FormatedInvoices: invoiceTableT[] = invoices.map((item) => {
        return {
            CreatedAt: item.createdAt,
            customer: item.customer,
            customerName: item.customer.name,
            date: item.date,
            id: item.id,
            Items: item.orders,
            number: item.number,
            PaidAmount: item.payment?.amount || 0,
            amount: item.amount,
            orgid: item.organizationId,
        };
    });

    return {
        FormatedInvoices,
        currentMonthSales,
        currentYearSales,
        customersSales,
    };
}

"use server";
import prismaDb from "@/lib/prisma";

interface searchParamsT {
    customerid: string;
    ltdate: string;
    gtdate: string;
    Debit: string;
    Credit: string;
    items: string;
    orgid: string;
}

export const GetCustomerCredit = async (searchParams: searchParamsT) => {
    const customers = await prismaDb.customer.findMany({
        where: {
            organizationId: searchParams.orgid,
        },
    });

    const fromDate = searchParams.gtdate
        ? new Date(searchParams.gtdate).toISOString()
        : undefined;
    const toDate = searchParams.ltdate
        ? new Date(searchParams.ltdate).toISOString()
        : undefined;

    const customer = await prismaDb.customer.findFirst({
        where: {
            id: searchParams.customerid,
            organizationId: searchParams.orgid,
        },
        include: {
            invoices:
                searchParams.Debit === "true"
                    ? {
                          where: {
                              date: {
                                  gte: fromDate,
                                  lte: toDate,
                              },
                          },
                      }
                    : false,
            ReturnedInvoice:
                searchParams.Credit === "true"
                    ? {
                          where: {
                              date: {
                                  gte: fromDate,
                                  lte: toDate,
                              },
                          },
                      }
                    : false,
            Payment:
                searchParams.Credit === "true"
                    ? {
                          where: {
                              date: {
                                  gte: fromDate,
                                  lte: toDate,
                              },
                          },
                      }
                    : false,
        },
    });

    const CustomerInvoicesAndPayments: {
        type: "Debit" | "credit" | "openCredit";
        amount: number;
        date?: Date;
        number?: number;
        recordType: "inv" | "paymnet" | "returns" | "openCredit";
        kind?: string;
        id?: string;
    }[] = [];

    if (customer) {
        if (searchParams.Debit === "true") {
            customer.invoices.map((item) => {
                CustomerInvoicesAndPayments.push({
                    id: item.id,
                    type: "Debit",
                    recordType: "inv",
                    amount: item.amount,
                    date: item.date,
                    number: item.number,
                });
            });
        }
        if (searchParams.Credit === "true") {
            customer.Payment.map((item) => {
                CustomerInvoicesAndPayments.push({
                    id: item.id,
                    type: "credit",
                    recordType: "paymnet",
                    amount: item.amount,
                    date: item.date,
                    kind: item.method,
                });
            });
            customer.ReturnedInvoice.map((RetInv) =>
                CustomerInvoicesAndPayments.push({
                    id: RetInv.id,
                    type: "credit",
                    recordType: "returns",
                    amount: RetInv.amount,
                    date: RetInv.date,
                    kind: "مرتجع",
                    number: RetInv.number,
                })
            );
        }

        customer.CustomerCredit
            ? CustomerInvoicesAndPayments.push({
                  type: "openCredit",
                  recordType: "openCredit",
                  amount: customer.CustomerCredit,
                  kind: "openCredit",
              })
            : null;

        CustomerInvoicesAndPayments.sort((a, b) => {
            const dateA = a.date?.getTime() || 0;
            const dateB = b.date?.getTime() || 0;

            return dateA - dateB;
        });
    }

    return {
        customers,
        CustomerInvoicesAndPayments,
    };
};

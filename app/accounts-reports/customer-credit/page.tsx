import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import prismaDb from "@/lib/prisma";
import React from "react";

import InvoicesAndPayments from "./components/InvoicesAndPayments";

interface CustomerStatementProps {
    searchParams: {
        customerid: string;
        ltdate: string;
        gtdate: string;
        Debit: string;
        Credit: string;
        items: string;
    };
}

const CustomerReport: React.FC<CustomerStatementProps> = async ({
    searchParams,
}) => {
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
            invoices:
                searchParams.Debit === "true"
                    ? {
                          where: {
                              date: {
                                  gt: fromDate,
                                  lt: toDate,
                              },
                          },
                      }
                    : false,
            ReturnedInvoice:
                searchParams.Credit === "true"
                    ? {
                          where: {
                              date: {
                                  gt: fromDate,
                                  lt: toDate,
                              },
                          },
                      }
                    : false,
            Payment:
                searchParams.Credit === "true"
                    ? {
                          where: {
                              date: {
                                  gt: fromDate,
                                  lt: toDate,
                              },
                          },
                      }
                    : false,
        },
    });

    const CustomerInvoicesAndPayments: {
        type: string;
        amount: number;
        date?: Date;
        number?: number;

        kind?: string;
    }[] = [];

    if (customer) {
        if (searchParams.Debit === "true") {
            customer.invoices.map((item) => {
                CustomerInvoicesAndPayments.push({
                    type: "Debit",
                    amount: item.amount,
                    date: item.date,
                    number: item.number,
                });
            });
        }
        if (searchParams.Credit === "true") {
            customer.Payment.map((item) => {
                CustomerInvoicesAndPayments.push({
                    type: "Credit",
                    amount: item.amount,
                    date: item.date,
                    kind: item.method,
                });
            });
            customer.ReturnedInvoice.map((RetInv) =>
                CustomerInvoicesAndPayments.push({
                    type: "Credit",
                    amount: RetInv.amount,
                    date: RetInv.date,
                    kind: "مرتجع",
                })
            );
        }

        customer.CustomerCredit
            ? CustomerInvoicesAndPayments.push({
                  type: "openCredit",
                  amount: customer.CustomerCredit,
                  kind: "openCredit",
              })
            : null;

        CustomerInvoicesAndPayments.sort((a, b) => {
            const dateA = a.date?.getTime() || 0;
            const dateB = b.date?.getTime() || 0;

            return dateA - dateB;
        });
        console.log(CustomerInvoicesAndPayments);
    }
    return (
        <div className=" p-2 rounded-md z-50 relative min-h-screen">
            <div className="grid grid-cols-5 mb-2 gap-4 z-[100] ">
                <CustomerCommandComp
                    customers={customers}
                    slug={searchParams.customerid}
                />
                <DateSearch filter="gtdate" label="من تاريخ" />
                <DateSearch filter="ltdate" label="الي تاريخ" />
                <div className="flex items-center justify-center flex-col gap-2 flex-1 w-full">
                    <FilterCheckBox filtername="Credit" label="دائن" />
                    <FilterCheckBox filtername="Debit" label="مدين" />
                </div>
            </div>
            <InvoicesAndPayments
                CustomerInvoicesAndPayments={CustomerInvoicesAndPayments}
            />
        </div>
    );
};

export default CustomerReport;

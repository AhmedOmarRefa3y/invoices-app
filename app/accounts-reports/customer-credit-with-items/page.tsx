import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import prismaDb from "@/lib/prisma";
import React from "react";

import Refetch from "@/components/refetch";
import ItemsAndPayments from "./components/ItemsAndPayments";

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

export const dynamic = "force-dynamic";

const CustomerStatement: React.FC<CustomerStatementProps> = async ({
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
            invoices: {
                where: {
                    date: {
                        gt: fromDate,
                        lt: toDate,
                    },
                },
                include: {
                    lineItems: {
                        include: {
                            product: true,
                            invoice: true,
                        },
                        orderBy: {
                            invoice: {
                                date: "asc",
                            },
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
                item.lineItems.map((item) => {
                    CustomerItemsAndPayments.push({
                        type: "debit",
                        itemName: item.product.name,
                        ItemQuantity: item.quantity,
                        ItemPrice: item.product.price,
                        amount: item.amount,
                        date: item.invoice?.date,
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
        CustomerItemsAndPayments.sort((a, b) => {
            const dateA = a.date?.getTime() || 0;
            const dateB = b.date?.getTime() || 0;

            return dateA - dateB;
        });
    }
    return (
        <div className=" p-2 rounded-md z-50 relative min-h-screen">
            <Refetch />
            <div className="grid grid-cols-5 mb-2 gap-4 z-[100] ">
                <CustomerCommandComp
                    customers={customers}
                    slug={searchParams.customerid}
                />
                <DateSearch filter="gtdate" label="من تاريخ" />
                <DateSearch filter="ltdate" label="الي تاريخ" />
                <div className="flex items-center justify-center flex-col gap-2 flex-1 w-full">
                    <FilterCheckBox filtername="Debit" label="مدين" />
                    <FilterCheckBox filtername="Credit" label="دائن" />
                </div>
            </div>
            <ItemsAndPayments
                CustomerItemsAndPayments={CustomerItemsAndPayments}
            />
        </div>
    );
};

export default CustomerStatement;

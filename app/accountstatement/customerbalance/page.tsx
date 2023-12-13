import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import prismaDb from "@/lib/prisma";
import React from "react";
import InvoicesAndPayments from "./components/InvoicesAndPayments";
import ItemsAndPayments from "./components/ItemsAndPayments";
import Refetch from "@/components/refetch";

interface CustomerStatementProps {
    searchParams: {
        customerid: string;
        ltdate: string;
        gtdate: string;
        showinv: string;
        showPayments: string;
        items: string;
    };
}

export const dynamic = "force-dynamic";

const CustomerStatement: React.FC<CustomerStatementProps> = async ({
    searchParams,
}) => {
    // console.log(searchParams);
    const customers = await prismaDb.customer.findMany({});

    const fromDate = searchParams.gtdate
        ? new Date(searchParams.gtdate).toISOString()
        : undefined;
    const toDate = searchParams.ltdate
        ? new Date(searchParams.ltdate).toISOString()
        : undefined;

    const Showitems = searchParams.items === "true";

    const customer = await prismaDb.customer.findFirst({
        where: {
            id: searchParams.customerid,
        },
        include: {
            invoices: {
                where: {
                    createdAt: {
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
                            createdAt: "asc",
                        },
                    },
                },
                orderBy: {
                    date: "desc",
                },
            },
            ReturnedInvoice: {
                where: {
                    createdAt: {
                        gt: fromDate,
                        lt: toDate,
                    },
                },
            },
            Payment: {
                where: {
                    createdAt: {
                        gt: fromDate,
                        lt: toDate,
                    },
                },
            },
        },
    });

    const CustomerInvoicesAndPayments: {
        type: string;
        amount: number;
        itemName?: string;
        ItemQuantity?: number;
        ItemPrice?: number;
        date?: Date;
        number?: number;
        createdAt?: Date;
        kind?: string;
    }[] = [];

    const CustomerItemsAndPayments: {
        type: string;
        amount: number;
        itemName?: string;
        ItemQuantity?: number;
        ItemPrice?: number;
        date?: Date;
        number?: number;
        createdAt?: Date;
        kind?: string;
    }[] = [];

    if (customer) {
        if (!Showitems) {
            if (searchParams.showinv !== "false") {
                customer.invoices.map((item) => {
                    let totalInvoiceAmount = 0;
                    item.lineItems.map((item) => {
                        let itemAmount = item.quantity * item.product.price;
                        totalInvoiceAmount = totalInvoiceAmount + itemAmount;
                    });
                    CustomerInvoicesAndPayments.push({
                        type: "مدين",
                        date: item.date,
                        number: item.number,
                        amount: totalInvoiceAmount,
                        createdAt: item.createdAt,
                    });
                });
            }
            if (searchParams.showPayments !== "false") {
                customer.Payment.map((item) => {
                    CustomerInvoicesAndPayments.push({
                        type: "دائن",
                        amount: item.amount,
                        date: item.date,
                        kind: item.method,
                    });
                });
            }
            customer.ReturnedInvoice.map((RetInv) =>
                CustomerInvoicesAndPayments.push({
                    type: "Ret",
                    amount: RetInv.amount,
                    date: RetInv.date,
                    kind: "مرتجع",
                })
            );
            CustomerInvoicesAndPayments.sort((a, b) => {
                const dateA = a.date?.getTime() || 0;
                const dateB = b.date?.getTime() || 0;

                return dateA - dateB;
            });
        }
        if (Showitems) {
            customer.invoices.map((item) => {
                item.lineItems.map((item) => {
                    console.log(item);
                    CustomerItemsAndPayments.push({
                        type: "مدين",
                        itemName: item.product.name,
                        ItemQuantity: item.quantity,
                        ItemPrice: item.product.price,
                        amount: item.amount,
                        date: item.invoice?.date,
                    });
                });
            });
            if (searchParams.showPayments !== "false") {
                customer.Payment.map((item) => {
                    CustomerItemsAndPayments.push({
                        type: "دائن",
                        kind: item.method,
                        amount: item.amount,
                        date: item.date,
                    });
                });
                customer.ReturnedInvoice.map((item) => {
                    CustomerItemsAndPayments.push({
                        type: "دائن",
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
    }

    let currentCredit = 0;

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
                    <FilterCheckBox
                        filtername="showPayments"
                        label="عرض السداد"
                    />
                    {!Showitems && (
                        <FilterCheckBox
                            filtername="showinv"
                            label="عرض الفواتير"
                        />
                    )}
                    <FilterCheckBox
                        filtername="items"
                        label="كشف حساب بالاصناف"
                    />
                </div>
            </div>
            {Showitems ? (
                <ItemsAndPayments
                    CustomerItemsAndPayments={CustomerItemsAndPayments}
                />
            ) : (
                <InvoicesAndPayments
                    CustomerInvoicesAndPayments={CustomerInvoicesAndPayments}
                />
            )}
        </div>
    );
};

export default CustomerStatement;

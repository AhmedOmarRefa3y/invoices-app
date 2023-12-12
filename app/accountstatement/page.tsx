import Refetch from "@/components/refetch";
import prismaDb from "@/lib/prisma";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

const AccountStatementPage = async () => {
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
            ReturnedInvoice: {
                include: {
                    lineItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });
    const CustomersBalance = customers.map((customer) => {
        let TotalInvoicesAmount = 0;
        let TotalRetInvoicesAmount = 0;
        let Totalpayments = 0;
        customer.invoices.map((invoice) => {
            // let invoiceAmount = 0;
            // invoice.lineItems.map((item) => {
            //     let amount = item.quantity * item.product.price;
            //     invoiceAmount = invoiceAmount + amount;
            // });
            TotalInvoicesAmount = invoice.amount + TotalInvoicesAmount;
        });

        customer.Payment.map((payment) => {
            Totalpayments = Totalpayments + payment.amount;
        });
        customer.ReturnedInvoice.map((RetInvoice) => {
            TotalRetInvoicesAmount += RetInvoice.amount;
        });
        return {
            id: customer.id,
            name: customer.name,
            TotalInvoicesAmount,
            Totalpayments,
            TotalRetInvoicesAmount,
            currntBalance:
                TotalInvoicesAmount - (Totalpayments + TotalRetInvoicesAmount),
        };
    });

    console.log(CustomersBalance[0]);
    return (
        <div className="mt-4 mx-4">
            <Refetch />
            <table className="table table-lg h-full  rounded-md">
                <thead>
                    <tr>
                        <th align="center" className=" text-black text-lg"></th>
                        <th
                            align="center"
                            className=" text-black text-lg  border border-black"
                            colSpan={2}
                        >
                            الحركة
                        </th>

                        <th
                            align="center"
                            className=" text-black text-lg border border-black"
                            colSpan={2}
                        >
                            الرصيد
                        </th>
                    </tr>
                    <tr>
                        <th
                            align="center"
                            className=" text-black text-lg border border-black"
                        >
                            اسم العميل
                        </th>
                        <th
                            align="center"
                            className=" text-black text-lg border border-black"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className=" text-black text-lg border border-black"
                        >
                            دائن
                        </th>
                        <th
                            align="center"
                            className=" text-black text-lg border border-black"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className=" text-black text-lg border border-black"
                        >
                            دائن
                        </th>
                        <th
                            align="center"
                            className=" text-black text-lg border border-black"
                        >
                            كشف حساب
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {CustomersBalance.map((customer) => {
                        return (
                            <tr className="mt-7" key={customer.id}>
                                <td
                                    align="center"
                                    className=" text-black text-xl border border-black"
                                >
                                    {customer.name}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl border border-black"
                                >
                                    {customer.TotalInvoicesAmount > 0
                                        ? customer.TotalInvoicesAmount
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl border border-black"
                                >
                                    {customer.Totalpayments +
                                        customer.TotalRetInvoicesAmount >
                                    0
                                        ? customer.Totalpayments +
                                          customer.TotalRetInvoicesAmount
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl border border-black"
                                >
                                    {customer.currntBalance > 0
                                        ? customer.currntBalance
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl border border-black"
                                >
                                    {customer.currntBalance >= 0
                                        ? ""
                                        : customer.currntBalance * -1}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl border border-black"
                                >
                                    <Link
                                        href={`/accountstatement/customerbalance/?customerid=${customer.id}&showPayments=true&showinv=true&items=true`}
                                        className="bg-orange-400 p-2 rounded-md"
                                    >
                                        كشف حساب
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AccountStatementPage;

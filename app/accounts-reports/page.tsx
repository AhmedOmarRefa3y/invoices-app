import Refetch from "@/components/refetch";
import { Button } from "@/components/ui/button";
import DeleteCustomerBtn from "@/components/ui/deleteCustomerBtn";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import prismaDb from "@/lib/prisma";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

const AccountStatementPage = async () => {
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
    console.log(CustomersBalance);

    return (
        <div className="mt-4 mx-4 h-full min-h-screen">
            <Refetch />
            <table className="table table-xs h-full  rounded-md">
                <thead>
                    <tr>
                        <th align="center" className=" text-black text-lg"></th>
                        <th
                            align="center"
                            className=" text-black text-lg  border border-black"
                            colSpan={2}
                        >
                            رصيد افتتاحي
                        </th>
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
                        const PageNum = Math.ceil(
                            customer.customerRecordsNumber / 15
                        );
                        const ItemsPageNum = Math.ceil(
                            customer.customerRecordsNumberWithitems / 15
                        );

                        return (
                            <tr key={customer.id}>
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
                                    {customer.CustomerCredit > 0
                                        ? customer.CustomerCredit
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl border border-black"
                                >
                                    {customer.CustomerCredit < 0
                                        ? customer.CustomerCredit * -1
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl border border-black"
                                >
                                    {customer.CustomerTotalDebit > 0
                                        ? customer.CustomerTotalDebit
                                        : ""}
                                </td>
                                <td
                                    align="center"
                                    className=" text-black text-xl border border-black"
                                >
                                    {customer.CustomerTotalCredit > 0
                                        ? customer.CustomerTotalCredit
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
                                    className=" text-black text-xl border border-black flex flex-col gap-1 items-center justify-center "
                                >
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 "
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="flex flex-col">
                                            <DropdownMenuItem>
                                                <Link
                                                    href={`/accounts-reports/customer-credit/?customerid=${
                                                        customer.id
                                                    }&Debit=true&Credit=true&page=${
                                                        PageNum < 1
                                                            ? 1
                                                            : PageNum
                                                    }`}
                                                    className="bg-orange-400 p-2 rounded-md basis-[100%] text-center"
                                                >
                                                    كشف حساب
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link
                                                    href={`/accounts-reports/customer-credit-with-items/?customerid=${
                                                        customer.id
                                                    }&Debit=true&Credit=true&page=${
                                                        ItemsPageNum < 1
                                                            ? 1
                                                            : ItemsPageNum
                                                    }`}
                                                    className="bg-orange-400 p-2 rounded-md basis-[100%] text-center"
                                                >
                                                    كشف حساب بالاصناف
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <DeleteCustomerBtn
                                                    id={customer.id}
                                                />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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

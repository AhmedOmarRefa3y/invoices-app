import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import prismaDb from "@/lib/prisma";
import React from "react";

interface CustomerStatementProps {
    searchParams: {
        customerid: string;
        ltdate: string;
        gtdate: string;
        showinv: string;
        showPayments: string;
    };
}

const CustomerStatement: React.FC<CustomerStatementProps> = async ({
    searchParams,
}) => {
    const customers = await prismaDb.customer.findMany();

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
                    createdAt: {
                        gt: fromDate,
                        lt: toDate,
                    },
                },
                include: {
                    lineItems: {
                        include: {
                            product: true,
                        },
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
        date?: Date;
        number?: number;
        amount: number;
        createdAt?: Date;
    }[] = [];

    if (customer) {
        if (searchParams.showinv !== "false") {
            customer.invoices.map((item) => {
                let totalInvoiceAmount = 0;
                item.lineItems.map((item) => {
                    let itemAmount = item.quantity * item.product.price;
                    totalInvoiceAmount = totalInvoiceAmount + itemAmount;
                });
                CustomerInvoicesAndPayments.push({
                    type: "invoice",
                    date: item.createdAt,
                    number: item.number,
                    amount: totalInvoiceAmount,
                    createdAt: item.createdAt,
                });
            });
        }
        if (searchParams.showPayments !== "false") {
            customer.Payment.map((item) => {
                CustomerInvoicesAndPayments.push({
                    type: "payment",
                    amount: item.amount,
                    date: item.createdAt,
                });
            });
        }
        CustomerInvoicesAndPayments.sort((a, b) => {
            const dateA = a.date?.getTime() || 0;
            const dateB = b.date?.getTime() || 0;

            return dateA - dateB;
        });
    }

    let currentCredit = 0;

    return (
        <div className="mt-2 rounded-md z-50">
            <div className="grid grid-cols-5 mb-4 gap-4 z-[100] justify-center items-center">
                <CustomerCommandComp
                    customers={customers}
                    slug={searchParams.customerid}
                />
                <DateSearch filter="gtdate" label="من تاريخ" />
                <DateSearch filter="ltdate" label="الي تاريخ" />
                <div className="flex items-center justify-center flex-col gap-2">
                    <FilterCheckBox
                        filtername="showPayments"
                        label="عرض السداد"
                    />
                    <FilterCheckBox filtername="showinv" label="عرض الفواتير" />
                </div>
            </div>
            <table className="table table-xs ">
                {/* head */}
                <thead>
                    <tr className="bg-slate-500">
                        <th
                            align="center"
                            className="text-lg text-black border border-black w-2/12"
                        >
                            التاريخ
                        </th>
                        <th
                            align="center"
                            className="text-lg text-black border border-black w-4/12"
                        >
                            البيان
                        </th>
                        <th
                            align="center"
                            className="text-lg text-black border border-black"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className="text-lg text-black border border-black"
                        >
                            دائن
                        </th>
                        <th
                            align="center"
                            className="text-lg text-black border border-black"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className="text-lg text-black border border-black"
                        >
                            دائن
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    {CustomerInvoicesAndPayments?.map((item) => {
                        if (item.type === "invoice") {
                            currentCredit = currentCredit + item.amount;
                            return (
                                <tr key={item.number}>
                                    <th
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black w-2/12"
                                    >
                                        {item.date?.toLocaleDateString(
                                            "ar-EG",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </th>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black w-6/12"
                                    >
                                        فاتورة رقم{" "}
                                        {item.number
                                            ? item.number.toLocaleString(
                                                  "ar-EG",
                                                  {
                                                      useGrouping: false,
                                                  }
                                              )
                                            : ""}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {item.amount.toLocaleString("ar-EG", {
                                            useGrouping: false,
                                        })}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    ></td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {currentCredit > 0
                                            ? currentCredit.toLocaleString(
                                                  "ar-EG",
                                                  {
                                                      useGrouping: false,
                                                  }
                                              )
                                            : ""}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {currentCredit < 0
                                            ? (
                                                  currentCredit * -1
                                              ).toLocaleString("ar-EG", {
                                                  useGrouping: false,
                                              })
                                            : ""}
                                    </td>
                                </tr>
                            );
                        } else {
                            currentCredit = currentCredit - item.amount;
                            return (
                                <tr key={item.number}>
                                    <th
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {/* {item.date?.toDateString()} */}
                                        {item.date?.toLocaleDateString(
                                            "ar-EG",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </th>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        سداد
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    ></td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {item.amount.toLocaleString("ar-EG", {
                                            useGrouping: false,
                                        })}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {currentCredit > 0
                                            ? currentCredit.toLocaleString(
                                                  "ar-EG",
                                                  {
                                                      useGrouping: false,
                                                  }
                                              )
                                            : ""}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {currentCredit < 0
                                            ? (
                                                  currentCredit * -1
                                              ).toLocaleString("ar-EG", {
                                                  useGrouping: false,
                                              })
                                            : ""}
                                    </td>
                                </tr>
                            );
                        }
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerStatement;

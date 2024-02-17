"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import Pagination from "../../customer-credit/components/pagination";

interface ItemsAndPaymentsProps {
    CustomerItemsAndPayments: {
        type: string;
        amount: number;
        itemName?: string;
        ItemQuantity?: number;
        ItemPrice?: number;
        date?: Date;
        number?: number;
        kind?: string;
    }[];
}

const ItemsAndPayments: React.FC<ItemsAndPaymentsProps> = ({
    CustomerItemsAndPayments,
}) => {
    const params = useSearchParams();
    const page = parseInt(params.get("page") || "1", 10);

    const itemsPerPage = 15;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const displayedItems = CustomerItemsAndPayments.slice(startIndex, endIndex);
    console.log(CustomerItemsAndPayments);

    let itemSum = 0;
    let paymentSum = 0;

    CustomerItemsAndPayments.map((item, i) => {
        if (i < startIndex) {
            if (item.type === "debit") {
                itemSum += item.amount;
            } else {
                paymentSum += item.amount;
            }
        }
    });
    const CusOpenCredit =
        CustomerItemsAndPayments.find((item) => item.kind === "openCredit")
            ?.amount || 0;
    console.log(CusOpenCredit);
    let perviousCredit = itemSum - paymentSum;
    let currentCredit = 0 + perviousCredit + CusOpenCredit;
    return (
        <>
            <Pagination limit={CustomerItemsAndPayments.length} />
            <table className="table table-xs max-w-5xl mx-auto ">
                <thead>
                    <tr>
                        <th
                            align="center"
                            className=" text-black text-lg"
                            colSpan={4}
                        ></th>
                        <th
                            align="center"
                            className=" text-black text-lg  border border-gray-600"
                            colSpan={2}
                        >
                            الحركة
                        </th>

                        <th
                            align="center"
                            className=" text-black text-lg border border-gray-600"
                            colSpan={2}
                        >
                            الرصيد
                        </th>
                    </tr>
                    <tr className="bg-slate-500">
                        <th
                            align="center"
                            className="text-lg text-black border border-gray-600 w-[10%] "
                        >
                            التاريخ
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs text-black border border-gray-600  w-[40%]"
                        >
                            البيان
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs text-black border border-gray-600 w-[5%]"
                        >
                            الكمية
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs text-black border border-gray-600 w-[5%]"
                        >
                            السعر
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs text-black border border-gray-600 w-[10%]"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs text-black border border-gray-600 w-[10%]"
                        >
                            دائن
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs text-black border border-gray-600 w-[10%]"
                        >
                            مدين
                        </th>

                        <th
                            align="center"
                            className="sm:text-lg text-xs text-black border border-gray-600 w-[10%]"
                        >
                            دائن
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {page > 1 && (
                        <tr key={164231654}>
                            <th
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600 "
                            ></th>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600 "
                            >
                                ما قبله
                            </td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                            ></td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                            ></td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                            ></td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                            ></td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                            >
                                {perviousCredit > 0
                                    ? currentCredit.toLocaleString("ar-EG", {
                                          useGrouping: false,
                                      })
                                    : ""}
                            </td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                            >
                                {perviousCredit < 0
                                    ? (currentCredit * -1).toLocaleString(
                                          "ar-EG",
                                          {
                                              useGrouping: false,
                                          }
                                      )
                                    : ""}
                            </td>
                        </tr>
                    )}
                    {page === 1 && CusOpenCredit !== 0 && (
                        <tr
                            key={
                                Date.now() *
                                Math.random() *
                                14651 *
                                Math.round(Math.random() * 14)
                            }
                        >
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600 "
                            ></td>
                            <td
                                colSpan={5}
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600 "
                            >
                                رصيد اول
                            </td>

                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                            >
                                {CusOpenCredit && CusOpenCredit > 0
                                    ? CusOpenCredit.toLocaleString("ar-EG", {
                                          useGrouping: false,
                                      })
                                    : ""}
                            </td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                            >
                                {CusOpenCredit && CusOpenCredit < 0
                                    ? (CusOpenCredit * -1).toLocaleString(
                                          "ar-EG",
                                          {
                                              useGrouping: false,
                                          }
                                      )
                                    : ""}
                            </td>
                        </tr>
                    )}
                    {displayedItems?.map((item) => {
                        if (item.type === "debit") {
                            currentCredit = currentCredit + item.amount;
                            return (
                                <tr key={item.number}>
                                    <th
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600 "
                                    >
                                        {item.date?.toLocaleDateString(
                                            "ar-EG",
                                            {
                                                year: "numeric",
                                                month: "numeric",
                                                day: "numeric",
                                            }
                                        )}
                                    </th>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600 "
                                    >
                                        {item.itemName}
                                    </td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    >
                                        {item.ItemQuantity?.toLocaleString(
                                            "ar-EG",
                                            {
                                                useGrouping: false,
                                            }
                                        )}
                                    </td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    >
                                        {item.ItemPrice?.toLocaleString(
                                            "ar-EG",
                                            {
                                                useGrouping: false,
                                            }
                                        )}
                                    </td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    >
                                        {item.amount.toLocaleString("ar-EG", {
                                            useGrouping: false,
                                        })}
                                    </td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    ></td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
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
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
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
                        if (item.type === "credit") {
                            currentCredit = currentCredit - item.amount;
                            return (
                                <tr key={item.number}>
                                    <th
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    >
                                        {/* {item.date?.toDateString()} */}
                                        {item.date?.toLocaleDateString(
                                            "ar-EG",
                                            {
                                                year: "numeric",
                                                month: "numeric",
                                                day: "numeric",
                                            }
                                        )}
                                    </th>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    >
                                        {item.kind}
                                    </td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    ></td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    ></td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    ></td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                    >
                                        {item.amount.toLocaleString("ar-EG", {
                                            useGrouping: false,
                                        })}
                                    </td>
                                    <td
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
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
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
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
        </>
    );
};

export default ItemsAndPayments;

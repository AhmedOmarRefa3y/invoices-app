"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

interface ItemsAndPaymentsProps {
    CustomerItemsAndPayments: {
        type: string;
        amount: number;
        itemName?: string;
        ItemQuantity?: number;
        ItemPrice?: number;
        date?: Date;
        number?: number;
        createdAt?: Date;
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

    let itemSum = 0;
    let paymentSum = 0;

    CustomerItemsAndPayments.map((item, i) => {
        if (i < startIndex) {
            if ((item.type === "Item")) {
                itemSum += item.amount;
            } else {
                paymentSum += item.amount;
            }
        }
    });
    let perviousCredit = itemSum - paymentSum;
    console.log(itemSum);
    console.log(paymentSum);
    console.log(perviousCredit);

    let currentCredit = 0 + perviousCredit;
    return (
        <table className="table table-xs max-w-5xl mx-auto ">
            {/* head */}
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
                        className="text-lg text-black border border-gray-600 w-[130px] "
                    >
                        التاريخ
                    </th>
                    <th
                        align="center"
                        className="sm:text-lg text-xs text-black border border-gray-600  "
                    >
                        البيان
                    </th>
                    <th
                        align="center"
                        className="sm:text-lg text-xs text-black border border-gray-600 "
                    >
                        الكمية
                    </th>
                    <th
                        align="center"
                        className="sm:text-lg text-xs text-black border border-gray-600 "
                    >
                        السعر
                    </th>
                    <th
                        align="center"
                        className="sm:text-lg text-xssm:text-lg text-xs text-black border border-gray-600 "
                    >
                        مدين
                    </th>
                    <th
                        align="center"
                        className="sm:text-lg text-xs text-black border border-gray-600 "
                    >
                        دائن
                    </th>
                    <th
                        align="center"
                        className="sm:text-lg text-xs text-black border border-gray-600 "
                    >
                        مدين
                    </th>

                    <th
                        align="center"
                        className="sm:text-lg text-xs text-black border border-gray-600 "
                    >
                        دائن
                    </th>
                </tr>
            </thead>
            <tbody>
                {/* row 1 */}
                <tr>
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
                            ? (currentCredit * -1).toLocaleString("ar-EG", {
                                  useGrouping: false,
                              })
                            : ""}
                    </td>
                </tr>
                {displayedItems?.map((item) => {
                    if (item.type === "Item") {
                        currentCredit = currentCredit + item.amount;
                        return (
                            <tr key={item.number}>
                                <th
                                    align="center"
                                    className="sm:text-lg text-xs text-black font-semibold border border-gray-600 "
                                >
                                    {item.date?.toLocaleDateString("ar-EG", {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric",
                                    })}
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
                                    {item.ItemPrice?.toLocaleString("ar-EG", {
                                        useGrouping: false,
                                    })}
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
                                        ? (currentCredit * -1).toLocaleString(
                                              "ar-EG",
                                              {
                                                  useGrouping: false,
                                              }
                                          )
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
                                    className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                >
                                    {/* {item.date?.toDateString()} */}
                                    {item.date?.toLocaleDateString("ar-EG", {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric",
                                    })}
                                </th>
                                <td
                                    align="center"
                                    className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
                                >
                                    سداد
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
                                        ? (currentCredit * -1).toLocaleString(
                                              "ar-EG",
                                              {
                                                  useGrouping: false,
                                              }
                                          )
                                        : ""}
                                </td>
                            </tr>
                        );
                    }
                })}
            </tbody>
        </table>
    );
};

export default ItemsAndPayments;

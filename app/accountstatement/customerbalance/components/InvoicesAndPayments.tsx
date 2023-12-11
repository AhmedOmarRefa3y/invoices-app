import React from "react";

interface InvoicesAndPaymentsProps {
    CustomerInvoicesAndPayments: {
        type: string;
        date?: Date;
        number?: number;
        amount: number;
        createdAt?: Date;
    }[];
}

const InvoicesAndPayments: React.FC<InvoicesAndPaymentsProps> = ({
    CustomerInvoicesAndPayments,
}) => {
    let currentCredit = 0;
    return (
        <table className="table table-xs max-w-5xl mx-auto ">
            {/* head */}
            <thead>
                <tr>
                    <th
                        align="center"
                        className=" text-black text-lg"
                        colSpan={2}
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
                        className="sm:text-lg text-xs text-black border border-gray-600  w-[40%]"
                    >
                        البيان
                    </th>
                    <th
                        align="center"
                        className="sm:text-lg text-xssm:text-lg text-xs text-black border border-gray-600 w-[10%]"
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
                {/* row 1 */}
                {CustomerInvoicesAndPayments?.map((item) => {
                    if (item.type === "invoice") {
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
                                    فاتورة رقم{" "}
                                    {item.number
                                        ? item.number.toLocaleString("ar-EG", {
                                              useGrouping: false,
                                          })
                                        : ""}
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

export default InvoicesAndPayments;

"use client";
import { useSearchParams } from "next/navigation";
import Pagination from "./pagination";

interface InvoicesAndPaymentsProps {
    CustomerInvoicesAndPayments: {
        type: string;
        date?: Date;
        amount: number;
        number?: number;
        kind?: string;
    }[];
}

const InvoicesAndPayments: React.FC<InvoicesAndPaymentsProps> = ({
    CustomerInvoicesAndPayments,
}) => {
    const params = useSearchParams();
    const page = parseInt(params.get("page") || "1", 10);

    const itemsPerPage = 15;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const displayedItems = CustomerInvoicesAndPayments.slice(
        startIndex,
        endIndex
    );

    let itemSum = 0;
    let paymentSum = 0;

    CustomerInvoicesAndPayments.map((item, i) => {
        if (i < startIndex) {
            if (item.type === "Debit") {
                itemSum += item.amount;
            } else {
                paymentSum += item.amount;
            }
        }
    });
    const CusOpenCredit =
        CustomerInvoicesAndPayments.find((item) => item.kind === "openCredit")
            ?.amount || 0;
    console.log(CusOpenCredit);

    let perviousCredit = itemSum - paymentSum;
    let currentCredit = 0 + perviousCredit + CusOpenCredit;
    return (
        <>
            <Pagination limit={CustomerInvoicesAndPayments.length} />
            <table className="table table-xs max-w-5xl mx-auto ">
                <thead>
                    <tr
                        key={
                            Date.now() *
                            Math.random() *
                            14651 *
                            Math.round(Math.random() * 14)
                        }
                    >
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
                    <tr
                        className="bg-slate-500"
                        key={
                            Date.now() *
                            Math.random() *
                            14651 *
                            Math.round(Math.random() * 14)
                        }
                    >
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
                    {page > 1 && (
                        <tr
                            key={
                                Date.now() *
                                Math.random() *
                                14651 *
                                Math.round(Math.random() * 14)
                            }
                        >
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
                                className="sm:text-lg text-xs text-black font-semibold "
                            ></td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold "
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
                    {page === 1 && CusOpenCredit && (
                        <tr
                            key={
                                Date.now() *
                                Math.random() *
                                14651 *
                                Math.round(Math.random() * 14)
                            }
                        >
                            <th
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600 "
                            ></th>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold border border-gray-600 "
                            >
                                رصيد اول
                            </td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold "
                            ></td>
                            <td
                                align="center"
                                className="sm:text-lg text-xs text-black font-semibold "
                            ></td>

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
                        if (item.type === "Debit") {
                            currentCredit = currentCredit + item.amount;
                            return (
                                <tr
                                    key={
                                        Date.now() *
                                        Math.random() *
                                        14651 *
                                        Math.round(Math.random() * 14)
                                    }
                                >
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
                        if (item.type === "Credit") {
                            currentCredit = currentCredit - item.amount;
                            return (
                                <tr
                                    key={
                                        Date.now() *
                                        Math.random() *
                                        14651 *
                                        Math.round(Math.random() * 14)
                                    }
                                >
                                    <th
                                        align="center"
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600"
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

export default InvoicesAndPayments;

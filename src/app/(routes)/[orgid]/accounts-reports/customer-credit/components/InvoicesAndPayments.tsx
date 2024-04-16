"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./pagination";
import { useState } from "react";

interface InvoicesAndPaymentsProps {
    CustomerInvoicesAndPayments: {
        type: "Debit" | "credit" | "openCredit";
        amount: number;
        date?: Date;
        number?: number;
        recordType: "inv" | "paymnet" | "returns" | "openCredit";
        kind?: string;
        id?: string;
    }[];
    print: boolean;
}

const InvoicesAndPayments: React.FC<InvoicesAndPaymentsProps> = ({
    CustomerInvoicesAndPayments,
    print,
}) => {
    const router = useRouter();
    const params = useSearchParams();
    // const page = parseInt(params.get("page") || "1", 10);
    const itemsPerPage = print ? 30 : 15;
    const [page, setpage] = useState(
        Math.ceil(CustomerInvoicesAndPayments.length / itemsPerPage)
    );

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const displayedItems = CustomerInvoicesAndPayments.slice(
        startIndex,
        endIndex
    );

    let InvoicesSum = 0;
    let PaymentsSum = 0;

    // get the pervious pages credit
    CustomerInvoicesAndPayments.map((record, i) => {
        if (i < startIndex) {
            if (record.type === "Debit") {
                InvoicesSum += record.amount;
            }
            if (record.type === "credit") {
                PaymentsSum += record.amount;
            }
        }
    });
    const perviousCredit = InvoicesSum - PaymentsSum;
    const CusOpenCredit =
        CustomerInvoicesAndPayments.find((item) => item.kind === "openCredit")
            ?.amount || 0;

    let currentCredit = perviousCredit + CusOpenCredit;
    return (
        <div className="w-full pt-2">
            <Pagination
                limit={CustomerInvoicesAndPayments.length}
                SetPage={setpage}
                page={page}
                itemsPerPage={itemsPerPage}
            />

            <table className="w-full">
                <thead className=" text-black text-lg font-bold">
                    <tr key={1}>
                        <th align="center" colSpan={2}></th>
                        <th
                            align="center"
                            className=" bg-[#fafafa] border border-stone-300"
                            colSpan={2}
                        >
                            الحركة
                        </th>

                        <th
                            align="center"
                            className="bg-[#fafafa] border border-stone-300"
                            colSpan={2}
                        >
                            الرصيد
                        </th>
                    </tr>
                    <tr className="bg-[#fafafa]" key={2}>
                        <th
                            align="center"
                            className=" border border-stone-300 w-[10%]"
                        >
                            التاريخ
                        </th>
                        <th
                            align="center"
                            className="border border-stone-300  w-[40%]"
                        >
                            البيان
                        </th>
                        <th
                            align="center"
                            className=" border border-stone-300 w-[10%]"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className=" border border-stone-300 w-[10%]"
                        >
                            دائن
                        </th>
                        <th
                            align="center"
                            className=" border border-stone-300 w-[10%]"
                        >
                            مدين
                        </th>

                        <th
                            align="center"
                            className="bg-[#fafafa] border border-stone-300 w-[10%]"
                        >
                            دائن
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {page === 1 && CusOpenCredit !== 0 && (
                        <tr
                            key={4}
                            className="text-lg font-bold hover:bg-teal-300"
                        >
                            <td
                                colSpan={4}
                                align="center"
                                className=" border border-stone-300 "
                            >
                                رصيد اول
                            </td>

                            <td
                                align="center"
                                className=" border border-stone-300"
                            >
                                {CusOpenCredit && CusOpenCredit > 0
                                    ? CusOpenCredit.toLocaleString("ar-EG", {
                                          useGrouping: false,
                                      })
                                    : ""}
                            </td>
                            <td
                                align="center"
                                className=" border border-stone-300 "
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
                    {page > 1 && (
                        <tr
                            key={3}
                            className="text-lg font-bold hover:bg-teal-300"
                        >
                            <th
                                align="center"
                                className=" border border-stone-300 "
                            ></th>
                            <td
                                align="center"
                                className=" border border-stone-300 "
                            >
                                ما قبله
                            </td>
                            <td
                                align="center"
                                className=" border border-stone-300 "
                            ></td>
                            <td
                                align="center"
                                className=" border border-stone-300 "
                            ></td>

                            <td
                                align="center"
                                className=" border border-stone-300 "
                            >
                                {perviousCredit > 0
                                    ? currentCredit.toLocaleString("ar-EG", {
                                          useGrouping: false,
                                      })
                                    : ""}
                            </td>
                            <td
                                align="center"
                                className="border border-stone-300 "
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

                    {displayedItems?.map((item) => {
                        if (item.type === "Debit") {
                            currentCredit = currentCredit + item.amount;
                            return (
                                <tr
                                    key={item.id}
                                    className="text-black text-lg font-bold hover:bg-teal-300"
                                >
                                    <th
                                        align="center"
                                        className=" border border-stone-300 "
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
                                        className=" border border-stone-300 "
                                        onClick={() => {
                                            if (item.recordType === "inv")
                                                router.push(
                                                    `/invoices/sales/showInvoice?num=${item.number}`
                                                );
                                        }}
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
                                        className=" border border-stone-300 "
                                    >
                                        {item.amount.toLocaleString("ar-EG", {
                                            useGrouping: false,
                                        })}
                                    </td>
                                    <td
                                        align="center"
                                        className=" border border-stone-300 "
                                    ></td>
                                    <td
                                        align="center"
                                        className=" border border-stone-300 "
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
                                        className=" border border-stone-300 "
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
                                <tr
                                    key={item.id}
                                    className=" text-lg font-bold hover:bg-teal-300"
                                >
                                    <th
                                        align="center"
                                        className=" border border-stone-300 "
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
                                        className=" border border-stone-300 "
                                        onClick={() => {
                                            if (item.recordType === "returns")
                                                router.push(
                                                    `/returnedInvoices/showREtInvoice?num=${item.number}`
                                                );
                                        }}
                                    >
                                        {item.kind}
                                    </td>
                                    <td
                                        align="center"
                                        className=" border border-stone-300 "
                                    ></td>
                                    <td
                                        align="center"
                                        className=" border border-stone-300 "
                                    >
                                        {item.amount.toLocaleString("ar-EG", {
                                            useGrouping: false,
                                        })}
                                    </td>
                                    <td
                                        align="center"
                                        className=" border border-stone-300 "
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
                                        className=" border border-stone-300 "
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

export default InvoicesAndPayments;

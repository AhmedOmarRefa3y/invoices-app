"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./pagination";

interface InvoicesAndPaymentsProps {
    CustomerInvoicesAndPayments: {
        type: string;
        amount: number;
        date?: Date;
        number?: number;
        recordType: string;
        kind?: string;
        id?: string;
    }[];
}

const InvoicesAndPayments: React.FC<InvoicesAndPaymentsProps> = ({
    CustomerInvoicesAndPayments,
}) => {
    const router = useRouter();
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
            }
            if (item.type === "credit") {
                paymentSum += item.amount;
            }
        }
    });
    const CusOpenCredit =
        CustomerInvoicesAndPayments.find((item) => item.kind === "openCredit")
            ?.amount || 0;
    // console.log(CusOpenCredit);

    let perviousCredit = itemSum - paymentSum;
    let currentCredit = 0 + perviousCredit + CusOpenCredit;
    return (
        <div className="max-w-5xl ">
            <Pagination limit={CustomerInvoicesAndPayments.length} />

            <table className="w-full  rounded-lg overflow-hidden ">
                <thead className=" text-white text-lg font-bold">
                    <tr key={1}>
                        <th align="center" colSpan={2}></th>
                        <th
                            align="center"
                            className="bg-slate-500 border-r-0 border-r-transparent border-t-0 border-t-transparent   border border-gray-600 rounded-tr-lg overflow-hidden"
                            colSpan={2}
                        >
                            الحركة
                        </th>

                        <th
                            align="center"
                            className="bg-slate-500 border border-gray-600"
                            colSpan={2}
                        >
                            الرصيد
                        </th>
                    </tr>
                    <tr className="bg-slate-500" key={2}>
                        <th
                            align="center"
                            className=" border-r-0 border-r-transparent border-t-0 border-t-transparent   border border-gray-600 rounded-tr-lg overflow-hidden w-[10%]"
                        >
                            التاريخ
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs  border border-gray-600  w-[40%]"
                        >
                            البيان
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs    border border-gray-600 w-[10%]"
                        >
                            مدين
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs  border border-gray-600 w-[10%]"
                        >
                            دائن
                        </th>
                        <th
                            align="center"
                            className="sm:text-lg text-xs  border border-gray-600 w-[10%]"
                        >
                            مدين
                        </th>

                        <th
                            align="center"
                            className="sm:text-lg text-xs  border border-gray-600 w-[10%]"
                        >
                            دائن
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {page > 1 && (
                        <tr key={3}>
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
                    {page === 1 && CusOpenCredit !== 0 && (
                        <tr key={4}>
                            <td
                                colSpan={4}
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
                        if (item.type === "Debit") {
                            currentCredit = currentCredit + item.amount;
                            return (
                                <tr
                                    key={item.id}
                                    className=" hover:bg-red-400 duration-200 odd:bg-white even:bg-slate-200"
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
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600 hover:cursor-pointer hover:text-white "
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
                                <tr
                                    key={item.id}
                                    className=" hover:bg-red-400 duration-200 odd:bg-white even:bg-slate-200"
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
                                        className="sm:text-lg text-xs text-black font-semibold border border-gray-600 hover:cursor-pointer hover:text-white "
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
        </div>
    );
};

export default InvoicesAndPayments;

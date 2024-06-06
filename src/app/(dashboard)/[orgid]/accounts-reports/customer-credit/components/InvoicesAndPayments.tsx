"use client";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
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
}

const InvoicesAndPayments: React.FC<InvoicesAndPaymentsProps> = ({
    CustomerInvoicesAndPayments,
}) => {
    const router = useRouter();
    const params = useParams();

    const itemsPerPage = 30;
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
        <div className="w-full  max-h-[550px] print:max-h-full overflow-y-auto print:mt-2">
            <Pagination
                limit={CustomerInvoicesAndPayments.length}
                SetPage={setpage}
                page={page}
                itemsPerPage={itemsPerPage}
            />

            <table className="w-full">
                <thead className=" text-black text-lg font-bold sticky top-0 bg-white z-50 p-0">
                    <tr key={1}>
                        <th align="center" colSpan={2}></th>
                        <th align="center" colSpan={2} className="p-0">
                            <div className="bg-[#fafafa] border border-stone-300 border-b-0">
                                الحركة
                            </div>
                        </th>

                        <th align="center" colSpan={2} className="p-0">
                            <div className="bg-[#fafafa] border border-stone-300 border-b-0">
                                الرصيد
                            </div>
                        </th>
                    </tr>
                    <tr className="bg-[#fafafa]" key={2}>
                        <th align="center" className="  w-[10%] p-0">
                            <div className="bg-[#fafafa] border border-stone-300">
                                التاريخ
                            </div>
                        </th>
                        <th align="center" className="  w-[40%] p-0">
                            <div className="bg-[#fafafa] border border-stone-300">
                                البيان
                            </div>
                        </th>
                        <th align="center" className="  w-[10%] p-0">
                            <div className="bg-[#fafafa] border border-stone-300">
                                مدين
                            </div>
                        </th>
                        <th align="center" className="  w-[10%] p-0">
                            <div className="bg-[#fafafa] border border-stone-300">
                                دائن
                            </div>
                        </th>
                        <th align="center" className="  w-[10%] p-0">
                            <div className="bg-[#fafafa] border border-stone-300">
                                مدين
                            </div>
                        </th>

                        <th align="center" className=" w-[10%] p-0">
                            <div className="bg-[#fafafa] border border-stone-300">
                                دائن
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white max-h-80 overflow-hidden ">
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
                                                    `/${params.orgid}/invoices/sales/showInvoice?num=${item.number}`
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
                                                    `/${params.orgid}/returnedInvoices/showREtInvoice?num=${item.number}`
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

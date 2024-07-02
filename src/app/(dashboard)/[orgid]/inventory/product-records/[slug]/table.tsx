"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface RecordsTableT {
    records: {
        date: Date | undefined;
        type: "out" | "in";
        recordName: string;
        quantity: number;
        link?: string;
    }[];
    productInfo: {
        name: string | undefined;
        initialQuantitiy?: number | undefined;
    };
}

const RecordsTable: React.FC<RecordsTableT> = ({ records, productInfo }) => {
    const router = useRouter();
    let amount = productInfo.initialQuantitiy || 0;
    return (
        <div className=" max-w-full overflow-x-auto mx-auto  w-fit">
            <table className="min-w-[600px]  ">
                <thead className="text-lg text-black">
                    <tr>
                        <th
                            align="center"
                            className=" border border-stone-300 "
                            colSpan={2}
                        >
                            <div>
                                <span>حركة الصنف :</span>
                                <span className="text-sky-500 mr-1">
                                    {productInfo?.name}
                                </span>
                            </div>
                        </th>
                        <th
                            align="center"
                            className=" border border-stone-300 "
                            colSpan={2}
                        >
                            نوع الحركة
                        </th>
                    </tr>
                    <tr
                        className="bg-[fafafa] text-lg text-black"
                        key={
                            Date.now() *
                            Math.random() *
                            14651 *
                            Math.round(Math.random() * 14)
                        }
                    >
                        <th
                            align="center"
                            className=" border border-stone-300 w-[15%] "
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
                            className="  border border-stone-300 w-[10%]"
                        >
                            منصرف
                        </th>
                        <th
                            align="center"
                            className="border border-stone-300 w-[10%]"
                        >
                            وارد
                        </th>
                        <th
                            align="center"
                            className="border border-stone-300 w-[10%]"
                        >
                            الرصيد
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr
                    key={
                        Date.now() *
                        Math.random() *
                        14651 *
                        Math.round(Math.random() * 14)
                    }
                >
                    <th
                        align="center"
                        className="text-xs font-semibold text-black border border-gray-600 sm:text-lg "
                    ></th>
                    <td
                        align="center"
                        className="text-xs font-semibold text-black border border-gray-600 sm:text-lg "
                    >
                        ما قبله
                    </td>
                    <td
                        align="center"
                        className="text-xs font-semibold text-black sm:text-lg "
                    ></td>
                    <td
                        align="center"
                        className="text-xs font-semibold text-black sm:text-lg "
                    ></td>

                    <td
                        align="center"
                        className="text-xs font-semibold text-black border border-gray-600 sm:text-lg"
                    ></td>
                </tr> */}
                    {/* <tr
                    key={
                        Date.now() *
                        Math.random() *
                        14651 *
                        Math.round(Math.random() * 14)
                    }
                >
                    <th
                        align="center"
                        className="text-xs font-semibold text-black border border-gray-600 sm:text-lg "
                    ></th>
                    <td
                        align="center"
                        className="text-xs font-semibold text-black border border-gray-600 sm:text-lg "
                    >
                        رصيد اول
                    </td>
                    <td
                        align="center"
                        className="text-xs font-semibold text-black sm:text-lg "
                    ></td>
                    <td
                        align="center"
                        className="text-xs font-semibold text-black sm:text-lg "
                    ></td>
                    <td
                        align="center"
                        className="text-xs font-semibold text-black border border-gray-600 sm:text-lg"
                    >
                        {productInfo.initialQuantitiy}
                    </td>
                </tr> */}
                    {records.map((record, i) => {
                        record.type === "out"
                            ? (amount -= record.quantity)
                            : (amount += record.quantity);
                        return (
                            <tr
                                key={i + 1}
                                className="hover:bg-sky-500 cursor-pointer duration-300  font-semibold text-black"
                                onClick={() => {
                                    router.push(record.link!);
                                }}
                            >
                                <th
                                    align="center"
                                    className=" border border-stone-300"
                                >
                                    {record.date?.toLocaleDateString("ar-EG", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </th>
                                <td
                                    align="center"
                                    className=" border border-stone-300"
                                >
                                    {record.recordName}
                                </td>
                                <td
                                    align="center"
                                    className=" border border-stone-300"
                                >
                                    {record.type === "out" && record.quantity}
                                </td>
                                <td
                                    align="center"
                                    className=" border border-stone-300"
                                >
                                    {record.type === "in" && record.quantity}
                                </td>
                                <td
                                    align="center"
                                    className=" border border-stone-300"
                                >
                                    {amount}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default RecordsTable;

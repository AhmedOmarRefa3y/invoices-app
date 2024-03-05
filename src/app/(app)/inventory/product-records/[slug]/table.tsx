import React from "react";

interface RecordsTableT {
    records: {
        date: Date | undefined;
        type: "out" | "in";
        recordName: string;
        quantity: number;
    }[];
    productInfo: {
        name: string | undefined;
        initialQuantitiy?: number | undefined;
    };
}

const RecordsTable: React.FC<RecordsTableT> = ({ records, productInfo }) => {
    let amount = productInfo.initialQuantitiy || 0;
    return (
        <table className="table max-w-5xl mx-auto table-xs ">
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
                        className="text-lg text-black "
                        colSpan={2}
                    ></th>
                    <th
                        align="center"
                        className="text-lg text-black border border-gray-600 "
                        colSpan={2}
                    >
                        الحركة
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
                        منصرف
                    </th>
                    <th
                        align="center"
                        className="sm:text-lg text-xs text-black border border-gray-600 w-[10%]"
                    >
                        وارد
                    </th>
                    <th
                        align="center"
                        className="sm:text-lg text-xs text-black border border-gray-600 w-[10%]"
                    >
                        الرصيد
                    </th>
                </tr>
            </thead>
            <tbody>
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
                </tr>
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
                </tr>
                {records.map((record) => {
                    record.type === "out"
                        ? (amount -= record.quantity)
                        : (amount += record.quantity);
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
                                className="text-xs font-semibold text-black border border-gray-600 sm:text-lg "
                            >
                                {record.date?.toLocaleDateString()}
                            </th>
                            <td
                                align="center"
                                className="text-xs font-semibold text-black border border-gray-600 sm:text-lg "
                            >
                                {record.recordName}
                            </td>
                            <td
                                align="center"
                                className="text-xs font-semibold text-black border border-gray-600 sm:text-lg"
                            >
                                {record.type === "out" && record.quantity}
                            </td>
                            <td
                                align="center"
                                className="text-xs font-semibold text-black border border-gray-600 sm:text-lg"
                            >
                                {" "}
                                {record.type === "in" && record.quantity}
                            </td>
                            <td
                                align="center"
                                className="text-xs font-semibold text-black border border-gray-600 sm:text-lg"
                            >
                                {amount}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default RecordsTable;

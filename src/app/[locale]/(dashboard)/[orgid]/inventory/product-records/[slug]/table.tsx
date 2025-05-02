"use client";
import { useRouter } from "@/i18n/routing";
import React from "react";
import { useTranslations } from "next-intl";

interface RecordsTableT {
  records: Array<{
    date: Date | undefined;
    type: "out" | "in";
    recordName: string;
    quantity: number;
    link?: string;
    translationKey: string;
    translationValues?: Record<string, any>;
  }>;
  productInfo: {
    name: string | undefined;
  };
}

const RecordsTable: React.FC<RecordsTableT> = ({ records, productInfo }) => {
  const router = useRouter();
  const t = useTranslations("recordsTable");
  let balance = 0;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="text-lg text-black">
          <tr className="bg-gray-100">
            <th align="center" className=" border border-stone-300 " colSpan={2}>
              <div>
                <span>{t("itemMovement")}:</span>
                <span className="text-sky-500 mr-1">{productInfo?.name}</span>
              </div>
            </th>
            <th align="center" className=" border border-stone-300 " colSpan={2}>
              {t("movementType")}
            </th>
          </tr>
          <tr
            className="bg-[fafafa] text-lg text-black"
            key={Date.now() * Math.random() * 14651 * Math.round(Math.random() * 14)}
          >
            <th align="center" className=" border border-stone-300 w-[15%] ">
              {t("date")}
            </th>
            <th align="center" className="border border-stone-300  w-[40%]">
              {t("description")}
            </th>
            <th align="center" className="  border border-stone-300 w-[10%]">
              {t("out")}
            </th>
            <th align="center" className="border border-stone-300 w-[10%]">
              {t("in")}
            </th>
            <th align="center" className="border border-stone-300 w-[10%]">
              {t("balance")}
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => {
            if (record.type === "out") {
              balance -= record.quantity;
            } else {
              balance += record.quantity;
            }

            return (
              <tr
                key={index}
                onClick={() => record.link && router.push(record.link)}
                className="cursor-pointer hover:bg-blue-50"
              >
                <td className="border p-2 text-center">{record.date?.toLocaleDateString()}</td>
                <td className="border p-2 text-center">
                  {t(record.translationKey, record.translationValues)}
                </td>
                <td className="border p-2 text-center">
                  {record.type === "out" ? record.quantity : ""}
                </td>
                <td className="border p-2 text-center">
                  {record.type === "in" ? record.quantity : ""}
                </td>
                <td className="border p-2 text-center">{balance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;

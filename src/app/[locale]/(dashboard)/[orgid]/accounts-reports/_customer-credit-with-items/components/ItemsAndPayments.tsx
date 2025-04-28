"use client";
import { useSearchParams } from "@/i18n/routing";
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

const ItemsAndPayments: React.FC<ItemsAndPaymentsProps> = ({ CustomerItemsAndPayments }) => {
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
      if (item.type === "debit") {
        itemSum += item.amount;
      }
      if (item.type === "credit") {
        paymentSum += item.amount;
      }
    }
  });
  const CusOpenCredit =
    CustomerItemsAndPayments.find((item) => item.kind === "openCredit")?.amount || 0;
  // console.log(CusOpenCredit);
  let perviousCredit = itemSum - paymentSum;
  let currentCredit = 0 + perviousCredit + CusOpenCredit;
  return (
    <div className="max-w-5xl p-2">
      <Pagination limit={CustomerItemsAndPayments.length} />
      <table className="w-full ">
        <thead className=" text-black text-lg font-bold bg-[#fafafa]">
          <tr key={1}>
            <th align="center" colSpan={4}></th>
            <th align="center" className="  border border-stone-300" colSpan={2}>
              Movement
            </th>

            <th align="center" className="  border border-stone-300" colSpan={2}>
              Balance
            </th>
          </tr>
          <tr className=" text-black text-lg font-bold bg-[#fafafa]" key={2}>
            <th align="center" className="  border border-stone-300">
              Date
            </th>
            <th align="center" className=" border border-stone-300  w-[35%]">
              Description
            </th>
            <th align="center" className=" border border-stone-300 w-[5%]">
              Quantity
            </th>
            <th align="center" className=" border border-stone-300 w-[10%]">
              Price
            </th>
            <th align="center" className=" border border-stone-300 w-[10%]">
              Debit
            </th>
            <th align="center" className=" border border-stone-300 w-[10%]">
              Credit
            </th>
            <th align="center" className=" border border-stone-300 w-[10%]">
              Debit
            </th>
            <th align="center" className=" border border-stone-300 w-[10%]">
              Credit
            </th>
          </tr>
        </thead>
        <tbody className=" bg-white">
          {page > 1 && (
            <tr key={3} className="text-lg font-bold hover:bg-teal-300">
              <th align="center" className=" border border-stone-300 "></th>
              <td align="center" className=" border border-stone-300 ">
                Previous Balance
              </td>
              <td align="center" className=" border border-stone-300 "></td>
              <td align="center" className=" border border-stone-300 "></td>
              <td align="center" className=" border border-stone-300 "></td>
              <td align="center" className=" border border-stone-300 "></td>
              <td align="center" className=" border border-stone-300 ">
                {perviousCredit > 0
                  ? currentCredit.toLocaleString("ar-EG", {
                      useGrouping: false,
                    })
                  : ""}
              </td>
              <td align="center" className=" border border-stone-300 ">
                {perviousCredit < 0
                  ? (currentCredit * -1).toLocaleString("ar-EG", {
                      useGrouping: false,
                    })
                  : ""}
              </td>
            </tr>
          )}
          {page === 1 && CusOpenCredit !== 0 && (
            <tr key={4} className="text-lg font-bold hover:bg-teal-300">
              <td align="center" className=" border border-stone-300 "></td>
              <td colSpan={5} align="center" className=" border border-stone-300 ">
                Opening Balance
              </td>

              <td align="center" className=" border border-stone-300 ">
                {CusOpenCredit && CusOpenCredit > 0
                  ? CusOpenCredit.toLocaleString("ar-EG", {
                      useGrouping: false,
                    })
                  : ""}
              </td>
              <td align="center" className=" border border-stone-300 ">
                {CusOpenCredit && CusOpenCredit < 0
                  ? (CusOpenCredit * -1).toLocaleString("ar-EG", {
                      useGrouping: false,
                    })
                  : ""}
              </td>
            </tr>
          )}
          {displayedItems?.map((item) => {
            if (item.type === "debit") {
              currentCredit = currentCredit + item.amount;
              return (
                <tr
                  key={item.number || 2 * Math.random()}
                  className="text-lg font-bold hover:bg-teal-300"
                >
                  <th align="center" className=" border border-stone-300 ">
                    {item.date?.toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </th>
                  <td align="center" className=" border border-stone-300 ">
                    {item.itemName}
                  </td>
                  <td align="center" className=" border border-stone-300 ">
                    {item.ItemQuantity?.toLocaleString("ar-EG", {
                      useGrouping: false,
                    })}
                  </td>
                  <td align="center" className=" border border-stone-300 ">
                    {item.ItemPrice?.toLocaleString("ar-EG", {
                      useGrouping: false,
                    })}
                  </td>
                  <td align="center" className=" border border-stone-300 ">
                    {item.amount.toLocaleString("ar-EG", {
                      useGrouping: false,
                    })}
                  </td>
                  <td align="center" className=" border border-stone-300 "></td>
                  <td align="center" className=" border border-stone-300 ">
                    {currentCredit > 0
                      ? currentCredit.toLocaleString("ar-EG", {
                          useGrouping: false,
                        })
                      : ""}
                  </td>
                  <td align="center" className=" border border-stone-300 ">
                    {currentCredit < 0
                      ? (currentCredit * -1).toLocaleString("ar-EG", {
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
                  key={item.number || 2 * Math.random()}
                  className="text-lg font-bold hover:bg-teal-300"
                >
                  <th align="center" className=" border border-stone-300 ">
                    {/* {item.date?.toDateString()} */}
                    {item.date?.toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </th>
                  <td align="center" className=" border border-stone-300 ">
                    {item.kind}
                  </td>
                  <td align="center" className=" border border-stone-300 "></td>
                  <td align="center" className=" border border-stone-300 "></td>
                  <td align="center" className=" border border-stone-300 "></td>
                  <td align="center" className=" border border-stone-300 ">
                    {item.amount.toLocaleString("ar-EG", {
                      useGrouping: false,
                    })}
                  </td>
                  <td align="center" className=" border border-stone-300 ">
                    {currentCredit > 0
                      ? currentCredit.toLocaleString("ar-EG", {
                          useGrouping: false,
                        })
                      : ""}
                  </td>
                  <td align="center" className=" border border-stone-300 ">
                    {currentCredit < 0
                      ? (currentCredit * -1).toLocaleString("ar-EG", {
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

export default ItemsAndPayments;

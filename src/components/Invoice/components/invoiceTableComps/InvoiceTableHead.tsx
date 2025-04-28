import { useTranslations } from "next-intl";
import React from "react";

const InvoiceTableHead = () => {
  const t = useTranslations("sales_invoice");

  return (
    <thead>
      <tr className=" border-stone-300 border border-t-0 bg-[#fafafa] sticky top-0  ">
        <th align="center" className="text-lg  border  border-stone-300  w-[5%] "></th>
        <th align="center" className="text-lg  w-[55%] border border-s-0 border-stone-300">
          {t("product")}
        </th>
        <th align="center" className="text-lg  w-[10%] border border-s-0 border-stone-300">
          {t("quantity")}
        </th>
        <th align="center" className="text-lg    w-[10%] border border-s-0 border-stone-300">
          {t("price")}
        </th>
        <th align="center" className="text-lg    w-[10%] border border-s-0 border-stone-300">
          {t("Amount")}
        </th>
        <th align="center" className="text-lg   w-[5%] border border-s-0 border-stone-300"></th>
      </tr>
    </thead>
  );
};

export default InvoiceTableHead;

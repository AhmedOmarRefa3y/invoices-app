import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";
import useReturnsInvoice from "@/lib/zustand/ReturnsInvoice";
import useInvoice from "@/lib/zustand/invoiceStore";
import { useTranslations } from "next-intl";
import React from "react";

const InvoiceTableFoot = ({
  type,
}: {
  type: "sales" | "returns" | "purchases";
}) => {
  const SalesStore = useInvoice();
  const ReturnsStore = useReturnsInvoice();
  const PurchasesStore = usePurchaseInvoice();
  const t = useTranslations("sales_invoice");

  const items = {
    sales: SalesStore.items,
    returns: ReturnsStore.items,
    purchases: PurchasesStore.PurchaseInvoiceItems,
  };
  let totalAmount = 0;

  items[type].map((item) => {
    totalAmount += item.price * item.quantity;
  });

  return (
    <tfoot className="">
      <tr className="border border-t-0 sticky bottom-0 bg-[#fafafa] ">
        <th
          colSpan={4}
          align="center"
          className="pe-2 text-lg text-end  border border-t-0 border-stone-300"
        >
          {t("total")}
        </th>
        <td
          colSpan={2}
          align="center"
          className="text-lg text-black bg-sky-500  border border-t-0 border-stone-300"
        >
          {totalAmount.toFixed(2)}$
        </td>
      </tr>
    </tfoot>
  );
};

export default InvoiceTableFoot;

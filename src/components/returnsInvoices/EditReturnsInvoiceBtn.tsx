"use client";
import { cn } from "@/lib/utils";

import React from "react";
import { Button } from "../ui/button";
import { PurchaseInvoiceItem } from "@/lib/zustand/PurchaseStore";
import useReturnsInvoice from "@/lib/zustand/ReturnsInvoice";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export interface ReturnsInvoice {
  id: string;
  items: {
    id: string;
    name: string;
    number: number;
    price: number;
    quantity: number;
  }[];
  CustomerID: string;
  date: Date;
}

interface Props {
  Invoice: ReturnsInvoice;
  className?: string;
  orgid: string;
}

const EditReturnsInvoiceBtn: React.FC<Props> = ({ Invoice, className, orgid }) => {
  const router = useRouter();
  const ReturnsStore = useReturnsInvoice();
  const tCommon = useTranslations("common");

  if (!Invoice) return;

  const InvoiceItems: PurchaseInvoiceItem[] = Invoice.items.map((item, i) => {
    return {
      id: item.id || "",
      name: item.name || "",
      number: i + 1,
      price: item.price || 1,
      quantity: item.quantity,
    };
  });
  const { addItems, setCustomerId, clearData, setInvoiceId, updateDate } = ReturnsStore;
  const editInvoice = () => {
    clearData();
    setInvoiceId(Invoice.id);
    addItems(InvoiceItems);
    setCustomerId(Invoice.CustomerID);
    updateDate(Invoice.date);

    router.push(`/${orgid}/add-returns-invoice`);
  };

  return (
    <Button onClick={editInvoice} variant={"default"} className={cn("w-full", className)}>
      {tCommon("edit")}
    </Button>
  );
};

export default EditReturnsInvoiceBtn;

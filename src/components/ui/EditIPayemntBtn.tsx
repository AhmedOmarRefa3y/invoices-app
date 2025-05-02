"use client";
import React from "react";
import { Button } from "./button";

import { cn } from "@/lib/utils";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "use-intl";

interface editInvoiceBtnProps {
  paymentInfo: {
    id: string;
    number: number;
    customerName: string;
    customerID: string;
    date: Date;
    amount: number;
    method: string;
    notes: string;
  };
}

const EditIPayemntBtn: React.FC<editInvoiceBtnProps> = ({ paymentInfo }) => {
  const tCommon = useTranslations("common");
  const ModalsStore = useModals();

  const { setPaymentToBeEdited, SetAddPaymentModalIsOpen } = ModalsStore;
  const editInvoice = () => {
    setPaymentToBeEdited({
      id: paymentInfo.id,
      customerId: paymentInfo.customerID,
      amount: paymentInfo.amount,
      date: paymentInfo.date,
      method: paymentInfo.method,
      Note: paymentInfo.notes,
    });
    SetAddPaymentModalIsOpen(true);
  };

  return (
    <Button onClick={editInvoice} variant={"default"} className={cn("w-full")}>
      {tCommon("edit")}
    </Button>
  );
};

export default EditIPayemntBtn;

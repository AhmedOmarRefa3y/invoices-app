"use client";
import { Customer, Payment, Prisma } from "@prisma/client";
import React from "react";
import { Button } from "./button";
import useInvoice from "@/lib/zustand/invoiceStore";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import useModals from "@/lib/zustand/useModals";

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
  const ModalsStore = useModals();

  const { setPaymentToBeEdited, SetAddPaymentModalIsOpen, PaymentToBeEdited } = ModalsStore;
  const editInvoice = () => {
    // console.log(paymentInfo);

    setPaymentToBeEdited({
      id: paymentInfo.id,
      customerId: paymentInfo.customerID,
      amount: paymentInfo.amount,
      date: paymentInfo.date,
      method: paymentInfo.method,
      Note: paymentInfo.notes,
    });
    SetAddPaymentModalIsOpen(true);
    // console.log(PaymentToBeEdited);
  };

  return (
    <Button onClick={editInvoice} variant={"default"} className={cn("w-full")}>
      Edit
    </Button>
  );
};

export default EditIPayemntBtn;

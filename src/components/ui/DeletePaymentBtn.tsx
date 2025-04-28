"use client";

import { cn } from "@/lib/utils";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./button";
import { DeletePayment } from "@/actions/payments";

interface DeleteInvoiceBtnProps {
  id: string;
}

const DeletePaymentBtn: React.FC<DeleteInvoiceBtnProps> = ({ id }) => {
  const deletePayment = async () => {
    const DeletePaymentT = await DeletePayment(id);
    if (DeletePaymentT) {
      toast.success("Payment successfully deleted");
    } else {
      toast.error("Failed to delete the payment");
    }
  };
  return (
    <Button onClick={deletePayment} className={cn("w-full")} variant={"destructive"}>
      Delete
    </Button>
  );
};

export default DeletePaymentBtn;

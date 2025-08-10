"use client";

import { cn } from "@/lib/utils";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./button";
import { DeletePayment } from "@/actions/payments";
import { useTranslations } from "next-intl";

interface DeleteInvoiceBtnProps {
  id: string;
}

const DeletePaymentBtn: React.FC<DeleteInvoiceBtnProps> = ({ id }) => {
  const tCommon = useTranslations("common");
  const tPayments = useTranslations("addNewPaymentModal");

  const deletePayment = async () => {
    const response = await DeletePayment(id);
    if (response.status === "ok") {
      toast.success(tPayments("paymentDeleted") || "Payment successfully deleted");
    } else {
      // Show specific error message or a generic one
      if (response.message.includes("associated")) {
        toast.error(tPayments("payment_in_use_cannot_delete") || response.message);
      } else {
        toast.error(response.message || tCommon("unexpected_error_occurred") || "Failed to delete the payment");
      }
    }
  };
  return (
    <Button onClick={deletePayment} className={cn("w-full")} variant={"destructive"}>
      {tCommon("delete")}
    </Button>
  );
};

export default DeletePaymentBtn;

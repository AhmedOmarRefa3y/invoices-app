"use client";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DeletePayment } from "@/actions";

interface DeleteInvoiceBtnProps {
    id: string;
}

const DeletePaymentBtn: React.FC<DeleteInvoiceBtnProps> = ({ id }) => {
    const deletePayment = async () => {
        const DeletePayemntT = await DeletePayment(id);
        if (DeletePayemntT) {
            toast.success("تم حذف الاشعار بنجاح");
        } else {
            toast.error("لم يتم تعديل الاشعار بنجاح");
        }
    };
    return (
        <Button
            onClick={deletePayment}
            className={cn("w-full")}
            variant={"destructive"}
        >
            حذف
        </Button>
    );
};

export default DeletePaymentBtn;

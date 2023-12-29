"use client";
import { DeleteReturnedInvoice } from "@/actions/invoice";
import { cn } from "@/lib/utils";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./button";

interface DeleteInvoiceBtnProps {
    id: string;
    className?: string;
    url: string;
}

const DeleteRetInvoiceBtn: React.FC<DeleteInvoiceBtnProps> = ({
    id,

    className,
}) => {
    const deleteInvoice = async (id: string) => {
        try {
            const res = await DeleteReturnedInvoice(id);

            console.log("response", res);
            if (res.status === "ok") {
                toast.success("تم حذف الفاتورة بنجاح");
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("لم يتم حذف الفاتورة");
        }
    };
    return (
        <Button
            onClick={() => deleteInvoice(id)}
            className={cn("w-full", className)}
            variant={"destructive"}
        >
            حذف
        </Button>
    );
};

export default DeleteRetInvoiceBtn;

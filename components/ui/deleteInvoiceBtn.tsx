"use client";
import { DeleteInvoice } from "@/actions/invoice";
import { cn } from "@/lib/utils";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./button";

interface DeleteInvoiceBtnProps {
    id: string;
    className?: string;
    url: string;
}

const DeleteInvoiceBtn: React.FC<DeleteInvoiceBtnProps> = ({
    id,
    className,
}) => {
    const deleteInvoice = async (id: string) => {
        try {
            console.log("Delete Invoice Run");
            console.log("Delete Invoice id", id);
            const res = await DeleteInvoice(id);

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
            onClick={() => deleteInvoice}
            className={cn("w-full", className)}
            variant={"destructive"}
        >
            حذف
        </Button>
    );
};

export default DeleteInvoiceBtn;

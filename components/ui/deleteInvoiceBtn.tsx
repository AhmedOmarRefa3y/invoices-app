"use client";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DeleteInvoiceBtnProps {
    id: string;
    className?: string;
}

const DeleteInvoiceBtn: React.FC<DeleteInvoiceBtnProps> = ({
    id,
    className,
}) => {
    const router = useRouter();
    const deleteInvoice = async (id: string) => {
        try {
            const res = await axios.delete(`api/deleteinvoice/${id}`);
            // Handle the response as needed
            // console.log("Invoice deleted successfully", res.data);
            toast.success("تم حذف الفاتورة بنجاح");
            router.refresh();
        } catch (error) {
            // Handle errors
            // console.error("Error deleting invoice", error);
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

export default DeleteInvoiceBtn;

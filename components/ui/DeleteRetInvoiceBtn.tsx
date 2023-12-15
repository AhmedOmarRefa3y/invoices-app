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
    url: string;
}

const DeleteRetInvoiceBtn: React.FC<DeleteInvoiceBtnProps> = ({
    id,
    url,
    className,
}) => {
    const router = useRouter();
    const deleteInvoice = async (id: string) => {
        try {
            console.log("Delete Invoice Run");
            console.log("Delete Invoice id", id);
            const res = await axios.delete(`/api/${url}`, {
                data: {
                    id: id,
                },
            });

            console.log("response", res);
            if (res.status === 200) {
                toast.success("تم حذف الفاتورة بنجاح");
                router.refresh();
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

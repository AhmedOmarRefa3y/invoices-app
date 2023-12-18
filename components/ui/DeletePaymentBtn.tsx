"use client";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DeleteInvoiceBtnProps {
    id: string;
}

const DeletePaymentBtn: React.FC<DeleteInvoiceBtnProps> = ({ id }) => {
    const router = useRouter();
    const deletePayment = async (id: string) => {
        try {
            const res = await axios.delete(`/api/payments`, {
                data: {
                    id: id,
                },
            });

            console.log("response", res);
            if (res.status === 200) {
                toast.success("تم الحذف بنجاح");
                router.refresh();
            }
        } catch (error) {
            toast.error("لم يتم الحذف");
        }
    };
    return (
        <Button
            onClick={() => deletePayment(id)}
            className={cn("w-full")}
            variant={"destructive"}
        >
            حذف
        </Button>
    );
};

export default DeletePaymentBtn;

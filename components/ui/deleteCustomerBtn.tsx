"use client";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DeleteCustomerProps {
    id: string;
}

const DeleteCustomerBtn: React.FC<DeleteCustomerProps> = ({ id }) => {
    const router = useRouter();
    const DeleteCustomer = async (id: string) => {
        try {
            const res = await axios.delete(`/api/addnewcustomer`, {
                data: {
                    id: id,
                },
            });
            console.log("DeletedCustomer", res);
            if (res.status === 200) {
                toast.success("تم حذف العميل بنجاح");
                router.refresh();
            }
        } catch (error) {
            toast.error("لم يتم حذف العميل");
        }
    };
    return (
        <Button
            onClick={() => DeleteCustomer(id)}
            className={cn("w-full")}
            variant={"destructive"}
        >
            حذف
        </Button>
    );
};

export default DeleteCustomerBtn;

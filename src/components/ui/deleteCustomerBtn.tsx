"use client";
import { DeleteCustomer } from "@/app/actions/customer";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./button";
import toast from "react-hot-toast";

interface DeleteCustomerProps {
    id: string;
}

const DeleteCustomerBtn: React.FC<DeleteCustomerProps> = ({ id }) => {
    const DeleteCustomerByID = async () => {
        const DeletedCustomer = await DeleteCustomer(id);
        if (DeletedCustomer) {
            toast.success("تم حذف العميل بنجاح");
        } else {
            toast.error("لم يتم حذف العميل ");
        }
    };
    return (
        <Button
            onClick={DeleteCustomerByID}
            className={cn("w-full")}
            variant={"destructive"}
        >
            حذف
        </Button>
    );
};

export default DeleteCustomerBtn;

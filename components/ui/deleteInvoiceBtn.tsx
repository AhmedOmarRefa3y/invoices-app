"use client";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface DeleteInvoiceBtnProps {
    id: string;
}

const DeleteInvoiceBtn: React.FC<DeleteInvoiceBtnProps> = ({ id }) => {
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
            console.error("Error deleting invoice", error);
            toast.error("لم يتم حذف الفاتورة");
        }
    };
    return (
        <Button onClick={() => deleteInvoice(id)} variant={"destructive"}>
            حذف
        </Button>
    );
};

export default DeleteInvoiceBtn;

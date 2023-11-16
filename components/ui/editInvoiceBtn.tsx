"use client";
import { Invoice } from "@prisma/client";
import React from "react";
import { Button } from "./button";
import useInvoice from "@/lib/zustand";
import { useRouter } from "next/navigation";

interface editInvoiceBtnProps {
    Invoice: {
        id: string;
        customerName: string;
        customerId: string;
        date: Date;
        number: number;
        paidAmount: number | undefined;
        createdAt: Date;
        products: {
            id: string;
            name: string;
            quantity: number;
            price: number;
        }[];
    };
}

const EditInvoiceBtn: React.FC<editInvoiceBtnProps> = ({ Invoice }) => {
    const router = useRouter();
    const InvoiceStore = useInvoice();
    const {
        addItem,
        setCustomerId,
        setpaidAmount,
        clearData,
        setInvoiceId,
        updateDate,
    } = InvoiceStore;
    const editInvoice = () => {
        clearData();
        Invoice.products.map((item) => {
            addItem({
                id: item?.id,
                name: item?.name,
                price: item.price,
                quantity: item.quantity,
            });
        });
        setCustomerId(Invoice.customerId);
        setInvoiceId(Invoice.id);
        updateDate(Invoice.date);
        if (Invoice.paidAmount) {
            setpaidAmount(Invoice.paidAmount);
        }
        router.push("/");
    };
    console.log(Invoice.paidAmount);

    return (
        <Button onClick={editInvoice} variant={"secondary"}>
            تعديل
        </Button>
    );
};

export default EditInvoiceBtn;

"use client";
import { Customer, OrderItem, Prisma } from "@prisma/client";
import React from "react";
import { Button } from "./button";
import useInvoice from "@/lib/zustand";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface editInvoiceBtnProps {
    Invoice: invoice;
    className?: string;
}

type LineItem = Prisma.OrderItemGetPayload<{
    include: {
        Product: true;
    };
}>;
type customer = Prisma.CustomerGetPayload<{
    include: {
        Payment: true;
    };
}>;

interface invoice {
    id: string;
    number: number;
    customerName: string;
    Items: OrderItem[];
    date: Date;
    PaidAmount: number;
    CreatedAt: Date;
    customer: Customer;
}

const EditInvoiceBtn: React.FC<editInvoiceBtnProps> = ({
    Invoice,
    className,
}) => {
    const router = useRouter();
    const InvoiceStore = useInvoice();

    const {
        addItems,
        setCustomerId,
        setpaidAmount,
        clearData,
        setInvoiceId,
        updateDate,
    } = InvoiceStore;
    const editInvoice = () => {
        clearData();
        addItems(Invoice.Items);
        setCustomerId(Invoice.customer.id);
        setInvoiceId(Invoice.id);
        updateDate(Invoice.date);
        if (Invoice.PaidAmount) {
            setpaidAmount(Invoice.PaidAmount);
        }
        // console.log(InvoiceStore);

        router.push("/addinvoice/sales");
    };

    return (
        <Button
            onClick={editInvoice}
            variant={"default"}
            className={cn("w-full", className)}
        >
            تعديل
        </Button>
    );
};

export default EditInvoiceBtn;

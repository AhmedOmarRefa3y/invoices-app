"use client";
import { cn } from "@/lib/utils";
import useInvoice, { InvoiceItem } from "@/lib/zustand/invoiceStore";

import { Customer, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./button";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface editInvoiceBtnProps {
    Invoice: EditInvoiceT | null;
    className?: string;
}

type OrderItem = Prisma.OrderItemGetPayload<{
    include: {
        Product: true;
    };
}>;

export interface EditInvoiceT {
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
    const session = useSession();
    console.log(session);
    const router = useRouter();
    const InvoiceStore = useInvoice();
    if (!Invoice) return;

    const InvoiceItems: InvoiceItem[] = Invoice.Items.map((item, i) => {
        return {
            id: item.productId ? item.productId : item.productPackageId || "",
            name: item.Product?.name || "",
            number: i + 1,
            price: item.price,
            quantity: item.quantity,
        };
    });
    const {
        addItems,
        setCustomerId,
        setpaidAmount,
        clearData,
        setInvoiceId,
        updateDate,
    } = InvoiceStore;
    const editInvoice = () => {
        if (session.data?.user.role !== "ADMIN") {
            toast.error("ليس لديك صلاحيات للتعديل");
            return null;
        }
        clearData();
        addItems(InvoiceItems);
        setCustomerId(Invoice.customer.id);
        setInvoiceId(Invoice.id);
        updateDate(Invoice.date);
        if (Invoice.PaidAmount) {
            setpaidAmount(Invoice.PaidAmount);
        }

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

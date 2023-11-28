"use client";
import { Invoice, Prisma } from "@prisma/client";
import React from "react";
import { Button } from "./button";
import useInvoice from "@/lib/zustand";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface editInvoiceBtnProps {
    Invoice: invoice;
    className?: string;
}

type invoice = Prisma.InvoiceGetPayload<{
    include: {
        customer: true;
        lineItems: {
            include: {
                product: {
                    include: {
                        Parts: true;
                    };
                };
            };
        };
        payment: true;
    };
}>;

const EditInvoiceBtn: React.FC<editInvoiceBtnProps> = ({
    Invoice,
    className,
}) => {
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
        Invoice.lineItems.map((item) => {
            addItem({
                id: item?.id,
                name: item?.product.name,
                price: item.product.price,
                quantity: item.quantity,
            });
        });
        setCustomerId(Invoice.customerId);
        setInvoiceId(Invoice.id);
        updateDate(Invoice.date);
        if (Invoice.payment?.amount) {
            setpaidAmount(Invoice.payment?.amount);
        }
        console.log(InvoiceStore);

        router.push("/");
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

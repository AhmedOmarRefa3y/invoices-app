"use client";
import { Customer, Prisma } from "@prisma/client";
import React from "react";
import { Button } from "./button";
import useInvoice, { InvoiceItem } from "@/lib/zustand";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface editInvoiceBtnProps {
    Invoice: invoice;
    className?: string;
}

type OrderItem = Prisma.OrderItemGetPayload<{
    include: {
        Product: true;
        ProductPackage: {
            include: {
                Parts: true;
            };
        };
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
    console.log(Invoice.Items);

    const router = useRouter();
    const InvoiceStore = useInvoice();
    const InvoiceItems: InvoiceItem[] = Invoice.Items.map((item, i) => {
        return {
            id: item.productId ? item.productId : item.productPackageId || "",
            name: item.Product
                ? item.Product.name
                : item.ProductPackage?.name || "",
            number: i + 1,
            price: item.price,
            quantity: item.quantity,
            parts: item.productId ? undefined : item.ProductPackage?.Parts,
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
        clearData();
        addItems(InvoiceItems);
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

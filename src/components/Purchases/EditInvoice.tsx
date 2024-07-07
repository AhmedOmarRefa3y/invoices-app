"use client";
import { cn } from "@/lib/utils";

import { Customer, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import usePurchaseInvoice, {
    PurchaseInvoiceItem,
} from "@/lib/zustand/PurchaseStore";

export interface PurchInvoice {
    id: string;
    items: {
        id: string;
        name: string;
        number: number;
        price: number;
        quantity: number;
    }[];
    SupplierID: string;
    date: Date;
}

interface editInvoiceBtnProps {
    Invoice: PurchInvoice;
    className?: string;
    orgid: string;
}

const EditPurchInvoiceBtn: React.FC<editInvoiceBtnProps> = ({
    Invoice,
    className,
    orgid,
}) => {
    const router = useRouter();
    const InvoiceStore = usePurchaseInvoice();
    if (!Invoice) return;

    const InvoiceItems: PurchaseInvoiceItem[] = Invoice.items.map((item, i) => {
        return {
            id: item.id || "",
            name: item.name || "",
            number: i + 1,
            price: item.price || 1,
            quantity: item.quantity,
        };
    });
    const { AddItems, setSupplierId, ClearData, SetInvoiceId, UpdateDate } =
        InvoiceStore;
    const editInvoice = () => {
        console.log(Invoice);

        ClearData();
        SetInvoiceId(Invoice.id);
        AddItems(InvoiceItems);
        setSupplierId(Invoice.SupplierID);
        UpdateDate(Invoice.date);

        router.push(`/${orgid}/add-purchase-invoice`);
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

export default EditPurchInvoiceBtn;

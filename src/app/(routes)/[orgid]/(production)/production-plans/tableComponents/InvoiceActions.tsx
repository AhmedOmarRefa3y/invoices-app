"use client";
import { Button } from "@/components/ui/button";
import DeleteInvoiceBtn from "@/components/ui/deleteInvoiceBtn";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditInvoiceBtn from "@/components/ui/editInvoiceBtn";
import { Prisma } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";
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

export interface invoiceTableT {
    item: {
        id: string;
        number: number;
        customerName: string;
        Items: OrderItem[];
        date: Date;
        PaidAmount: number;
        CreatedAt: Date;
        customer: customer;
        amount: number;
    };
}

const InvoiceActions: React.FC<invoiceTableT> = ({ item }) => {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col">
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Link
                            href={`/invoices/sales/showInvoice?num=${item.number}`}
                            className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
                        >
                            عرض الفاتورة
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Link
                            className="flex-1  text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
                            href={`/invoices/sales/releaseorder?num=${item.number}`}
                        >
                            اذن الصرف
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="flex-1 "
                    >
                        <EditInvoiceBtn Invoice={item} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="flex-1"
                    >
                        <DeleteInvoiceBtn id={item.id} url="deleteinvoice" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default InvoiceActions;

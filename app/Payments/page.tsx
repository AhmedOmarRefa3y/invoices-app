import prismaDb from "@/lib/prisma";
import React from "react";
import { columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";
import { Prisma } from "@prisma/client";
import Refetch from "@/components/refetch";

type LineItem = Prisma.LineItemGetPayload<{
    include: {
        invoice: true;
        product: {
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
    Items: LineItem[];
    date: Date;
    PaidAmount: number;
    CreatedAt: Date;
    customer: customer;
}
export const dynamic = "force-dynamic";

const ShowInvoices = async () => {
    const Payments = await prismaDb.payment.findMany({
        include: {
            customer: {
                include: {
                    Payment: true,
                },
            },
        },
        orderBy: {
            number: "desc",
        },
    });

    const FormattedPayments: {
        number: number;
        customerName: string;
        date: Date;
        amount: number;
        method: string;
        notes: string;
    }[] = Payments.map((item) => {
        return {
            number: item.number,
            customerName: item.customer.name,
            date: item.createdAt,
            amount: item.amount,
            method: item.method,
            notes: item.notes,
        };
    });
    console.log(FormattedPayments);

    return (
        <div className=" border-gray-200    bg-opacity-50 relative">
            <Refetch />
            <DataTable columns={columns} data={FormattedPayments} />
        </div>
    );
};

export default ShowInvoices;

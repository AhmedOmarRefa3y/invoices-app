import prismaDb from "@/lib/prisma";
import React from "react";
import { columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";
import { Prisma } from "@prisma/client";

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
    const invoices = await prismaDb.invoice.findMany({
        include: {
            customer: {
                include: {
                    Payment: true,
                },
            },
            lineItems: {
                include: {
                    invoice: true,
                    product: {
                        include: {
                            Parts: true,
                        },
                    },
                },
            },
            payment: true,
        },
        orderBy: {
            number: "desc",
        },
    });

    const FormatedInvoices: invoice[] = invoices.map((item) => {
        return {
            CreatedAt: item.createdAt,
            customer: item.customer,
            customerName: item.customer.name,
            date: item.date,
            id: item.id,
            Items: item.lineItems,
            number: item.number,
            PaidAmount: item.payment?.amount || 0,
        };
    });

    return (
        <div className=" border-gray-200    bg-opacity-50 relative">
            {/* <InvoicesTable inovices={formattedInvoices} /> */}
            <DataTable columns={columns} data={FormatedInvoices} />
        </div>
    );
};

export default ShowInvoices;

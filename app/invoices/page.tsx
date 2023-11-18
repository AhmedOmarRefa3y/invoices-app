import InvoicesTable from "@/components/InvoicesTable";
import prismaDb from "@/lib/prisma";
import React from "react";
import { columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";

const ShowInvoices = async () => {
    const invoices = await prismaDb.invoice.findMany({
        include: {
            customer: true,
            lineItems: {
                include: {
                    product: true,
                },
            },
            payment: true,
        },
        orderBy: {
            number: "desc",
        },
    });

    const formattedInvoices = invoices.map((item) => {
        console.log(item.payment);
        return {
            id: item.id,
            customerName: item.customer.name,
            customerId: item.customerId,
            date: item.date,
            number: item.number,
            products: item.lineItems.map((item) => {
                return {
                    id: item.product.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                };
            }),
            paidAmount: item.payment?.amount,
            createdAt: item.createdAt,
            // item: item.lineItems.map(item=> {
            //     item.
            // })
        };
    });

    return (
        <div className="bg-gray-50 border-gray-200 border mt-3 rounded-md bg-opacity-50 relative">
            {/* <InvoicesTable inovices={formattedInvoices} /> */}
            <DataTable columns={columns} data={formattedInvoices} />
        </div>
    );
};

export default ShowInvoices;

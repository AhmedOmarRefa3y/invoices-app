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

    return (
        <div className="bg-gray-50 border-gray-200    bg-opacity-50 relative">
            {/* <InvoicesTable inovices={formattedInvoices} /> */}
            <DataTable columns={columns} data={invoices} />
        </div>
    );
};

export default ShowInvoices;

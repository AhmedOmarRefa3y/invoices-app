import prismaDb from "@/lib/prisma";
import { Customer } from "@prisma/client";
import { columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";

const ShowRetInvoices = async () => {
    const invoices = await prismaDb.returnedInvoice.findMany({
        include: {
            customer: true,
            lineItems: {
                include: {
                    invoice: true,
                    product: true,
                },
            },
        },
        orderBy: {
            number: "desc",
        },
    });

    const FormatedInvoices: {
        id: string;
        number: number;
        customerName: string;
        date: Date;
        customer: Customer;
        amount: number;
    }[] = invoices.map((item) => {
        return {
            amount: item.amount,
            customer: item.customer,
            customerName: item.customer.name,
            date: item.date,
            id: item.id,
            number: item.number,
        };
    });

    return (
        <div className=" border-gray-200    bg-opacity-50 relative">
            <DataTable columns={columns} data={FormatedInvoices} />
        </div>
    );
};

export default ShowRetInvoices;

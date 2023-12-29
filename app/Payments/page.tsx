
import prismaDb from "@/lib/prisma";
import { columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";

const ShowInvoices = async () => {
    const Payments = await prismaDb.payment.findMany({
        include: {
            customer: true,
        },
        orderBy: {
            date: "desc",
        },
    });

    const FormattedPayments: {
        customerID: string;
        id: string;
        number: number;
        customerName: string;
        date: Date;
        amount: number;
        method: string;
        notes: string;
    }[] = Payments.map((item) => {
        return {
            customerID: item.customerId,
            id: item.id,
            number: item.number,
            customerName: item.customer.name,
            date: item.date,
            amount: item.amount,
            method: item.method,
            notes: item.notes,
        };
    });
    console.log(FormattedPayments);

    return (
        <div className=" border-gray-200    bg-opacity-50 relative">
            <DataTable columns={columns} data={FormattedPayments} />
        </div>
    );
};

export default ShowInvoices;

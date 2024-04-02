import prismaDb from "@/lib/prisma";
import { columns } from "./tableComponents/columns";
import { TableUi } from "@/components/table";

interface paymentT {
    customerID: string;
    id: string;
    number: number;
    customerName: string;
    date: Date;
    amount: number;
    method: string;
    notes: string;
}
const ShowInvoices = async () => {
    const Payments = await prismaDb.payment.findMany({
        include: {
            customer: true,
        },
        orderBy: {
            date: "desc",
        },
    });

    const FormattedPayments: paymentT[] = Payments.map((item) => {
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

    return (
        <div className=" border-gray-200    bg-opacity-50 relative p-2">
            <TableUi
                columns={columns}
                data={FormattedPayments}
                filterAccessorKey="customerName"
                filterlabel="اسم العميل"
                filterplaceholder="ابحث عن العميل بالاسم"
                notfound="لا يوجد اشعارات متاحة"
            />
        </div>
    );
};

export default ShowInvoices;

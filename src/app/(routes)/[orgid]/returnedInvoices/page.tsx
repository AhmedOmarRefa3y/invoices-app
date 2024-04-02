import prismaDb from "@/lib/prisma";
import { Customer } from "@prisma/client";
import { Retinvoice, columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";
import { TableUi } from "@/components/table";

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

    const FormatedInvoices: Retinvoice[] = invoices.map((item) => {
        return {
            amount: item.amount,
            customer: item.customer,
            customerName: item.customer.name,
            date: item.date,
            id: item.id,
            number: item.number,
            orgid: item.organizationId,
        };
    });

    return (
        <div className=" border-gray-200    bg-opacity-50 relative">
            <TableUi
                columns={columns}
                data={FormatedInvoices}
                filterAccessorKey="customerName"
                filterlabel="اسم العميل"
                filterplaceholder="ابحث عن العميل بالاسم"
                notfound="لا يوجد فواتير متاحة"
            />
        </div>
    );
};

export default ShowRetInvoices;

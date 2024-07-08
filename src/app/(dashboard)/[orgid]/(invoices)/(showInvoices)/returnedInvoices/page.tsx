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

    const FormatedInvoices: Retinvoice[] = invoices.map((InvoiceData) => {
        return {
            amount: InvoiceData.amount,
            customer: InvoiceData.customer,
            customerName: InvoiceData.customer.name,
            date: InvoiceData.date,
            id: InvoiceData.id,
            number: InvoiceData.number,
            orgid: InvoiceData.organizationId,
            Invoice: {
                id: InvoiceData.id,
                items: InvoiceData.lineItems.map((item) => {
                    return {
                        id: item.id,
                        name: item.product.name,
                        number: item.ItemNumber,
                        price: item.price || 0,
                        quantity: item.quantity,
                    };
                }),
                CustomerID: InvoiceData.customerId,
                date: InvoiceData.date,
            },
        };
    });

    return (
        <div className=" border-gray-200    bg-opacity-50 relative w-full max-w-fit mx-auto">
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

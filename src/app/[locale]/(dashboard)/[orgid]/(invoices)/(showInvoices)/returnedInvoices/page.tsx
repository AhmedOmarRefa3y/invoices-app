import prismaDb from "@/lib/prisma";
import { Retinvoice, columns } from "./tableComponents/columns";
import { TableUi } from "@/components/table";

const ShowRetInvoices = async ({ params }: { params: { orgid: string } }) => {
  const invoices = await prismaDb.returnedInvoice.findMany({
    where: {
      organizationId: params.orgid,
    },
    include: {
      customer: true,
      orders: {
        include: {
          Invoice: true,
          Product: true,
        },
      },
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
  console.log(invoices);

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
        items: InvoiceData.orders.map((item) => {
          return {
            id: item.productId,
            name: item.Product.name,
            number: item.OrderNumber,
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
        filterlabel="Customer Name"
        filterplaceholder="Search by Customer Name"
        notfound="No invoices found"
      />
    </div>
  );
};

export default ShowRetInvoices;

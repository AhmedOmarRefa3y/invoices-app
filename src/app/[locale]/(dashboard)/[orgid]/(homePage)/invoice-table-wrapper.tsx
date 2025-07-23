import prismaDb from "@/lib/prisma";
import InvoiceTable from "./invoice-table";

interface InvoiceTableWrapperProps {
  orgid: string;
}

const InvoiceTableWrapper = async ({ orgid }: InvoiceTableWrapperProps) => {
  const invoices = await prismaDb.invoice.findMany({
    where: { organizationId: orgid },
    include: { customer: true },
    orderBy: { date: "desc" },
    take: 50,
  });

  return <InvoiceTable initialInvoices={invoices} />;
};

export default InvoiceTableWrapper;
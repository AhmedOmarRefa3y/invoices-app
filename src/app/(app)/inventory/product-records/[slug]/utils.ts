import prismaDb from "@/lib/prisma";

interface record {
    date: Date | undefined;
    type: "out" | "in";
    recordName: string;
    quantity: number;
}
export const getInventoryRecords = async (id: string) => {
    const product = await prismaDb.product.findFirst({
        where: { id },
    });
    const allRecords: record[] = [];
    const LineItems = await prismaDb.lineItem.findMany({
        include: {
            invoice: {
                include: {
                    customer: true,
                },
            },
            ProductionEvent: true,
            ReturnedInvoice: {
                include: {
                    customer: true,
                },
            },
        },
        where: {
            productId: id,
        },
    });
    LineItems.map((item) => {
        if (item.invoiceId) {
            allRecords.push({
                date: item.invoice?.date,
                quantity: item.quantity,
                type: "out",
                recordName: `فاتورة رقم ${item.invoice?.number} للعميل ${item.invoice?.customer.name}`,
            });
        }
        if (item.ReturnedInvoice) {
            allRecords.push({
                date: item.ReturnedInvoice?.date,
                quantity: item.quantity,
                type: "in",
                recordName: `فاتورة مرتجعات رقم ${item.ReturnedInvoice?.number} للعميل ${item.ReturnedInvoice?.customer.name}`,
            });
        }
        if (item.ProductionEvent) {
            allRecords.push({
                date: item.ProductionEvent.producedAt,
                quantity: item.quantity,
                type: "in",
                recordName: "prod",
            });
        }
    });

    allRecords.sort((a, b) => {
        const dateA = a.date?.getTime() || 0;
        const dateB = b.date?.getTime() || 0;

        return dateA - dateB;
    });
    return { allRecords, product };
};

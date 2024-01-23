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
        include: {
            InventoryRecord: {
                where: {
                    year: 2024,
                },
            },
        },
    });
    const allRecords: record[] = [];

    const invoices = await prismaDb.lineItem.findMany({
        where: { productId: id },
        include: {
            invoice: {
                include: {
                    customer: true,
                },
            },
            ReturnedInvoice: {
                include: {
                    customer: true,
                },
            },
        },
    });

    const productions = await prismaDb.productionEvent.findMany({
        where: { productId: id },
    });
    invoices.map((item) => {
        if (item.invoiceId) {
            allRecords.push({
                date: item.invoice?.date,
                quantity: item.quantity,
                type: "out",
                recordName: `فاتورة رقم ${item.invoice?.number} للعميل ${item.invoice?.customer.name}`,
            });
        } else {
            allRecords.push({
                date: item.ReturnedInvoice?.date,
                quantity: item.quantity,
                type: "in",
                recordName: `فاتورة مرتجعات رقم ${item.ReturnedInvoice?.number} للعميل ${item.ReturnedInvoice?.customer.name}`,
            });
        }
    });
    productions.map((item) => {
        allRecords.push({
            date: item.producedAt,
            quantity: item.quantity,
            type: "in",
            recordName: "prod",
        });
    });
    allRecords.sort((a, b) => {
        const dateA = a.date?.getTime() || 0;
        const dateB = b.date?.getTime() || 0;

        return dateA - dateB;
    });
    return { allRecords, product };
};

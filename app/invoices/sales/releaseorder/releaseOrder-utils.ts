import { Prisma } from "@prisma/client";

type invoice = Prisma.InvoiceGetPayload<{
    include: {
        customer: true;
        lineItems: {
            include: {
                product: {
                    include: {
                        Parts: {
                            include: {
                                product: {
                                    include: {
                                        unit: true;
                                    };
                                };
                            };
                        };
                        unit: true;
                    };
                };
            };
        };
        payment: true;
    };
}>;

interface MergedItem {
    quantity: number;
    name: string;
    lineItemQuantity: number;
    unit: string | undefined;
}

export function ReleaseOrderData(invoices: invoice[], num: number) {
    let totalAmount = 0;
    const curruntInvoice: invoice | undefined = invoices.find(
        (invoice) => invoice.number === num
    );

    if (curruntInvoice && curruntInvoice.lineItems) {
        curruntInvoice.lineItems.forEach((item) => {
            totalAmount += item.quantity * item.price;
        });
    }

    const items: MergedItem[] | undefined = curruntInvoice?.lineItems.flatMap(
        (item) => {
            if (item.product.Parts.length > 0) {
                return item.product.Parts.map((part) => ({
                    name: part.name,
                    quantity: part.quantity,
                    lineItemQuantity: item.quantity,
                    unit: part.product.unit?.name,
                }));
            } else {
                return {
                    name: item.product.name,
                    quantity: item.quantity,
                    lineItemQuantity: 1,
                    unit: item.product.unit?.name,
                };
            }
        }
    );

    return {
        items,
        curruntInvoice,
    };
}

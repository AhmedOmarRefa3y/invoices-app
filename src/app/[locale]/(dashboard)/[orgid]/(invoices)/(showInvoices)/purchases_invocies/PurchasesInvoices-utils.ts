import prismaDb from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PurchasesCloumnsT } from "./PurchasesCloumns";
import { endOfYear, lastDayOfMonth, startOfMonth, startOfYear } from "date-fns";

export async function GetPurchasesInvoices(ORG_ID: string) {
    const invoices = await prismaDb.purchaseInvoice.findMany({
        where: {
            organizationId: ORG_ID,
        },
        include: {
            Supplier: true,

            lineItems: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            date: "desc",
        },
    });

    // current Month Sales

    const FormatedPurchasesInvoices: PurchasesCloumnsT[] = invoices.map(
        (item) => {
            return {
                CreatedAt: item.createdAt,
                SupplierName: item.Supplier.name,
                Supplier: item.Supplier,
                date: item.date,
                id: item.id,
                number: item.number,
                amount: item.amount,
                orgid: item.organizationId,
                invoice: {
                    date: item.date,
                    id: item.id,
                    items: item.lineItems.map((item) => {
                        return {
                            id: item.productId,
                            name: item.product.name,
                            number: item.ItemNumber,
                            price: item.price || 0,
                            quantity: item.quantity,
                        };
                    }),
                    SupplierID: item.SupplierId,
                },
            };
        }
    );

    return FormatedPurchasesInvoices;
}

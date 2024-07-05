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
            Supplier: {},
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
            };
        }
    );

    return FormatedPurchasesInvoices;
}

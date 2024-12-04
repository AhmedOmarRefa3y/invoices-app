"use server";

import prismaDb from "@/lib/prisma";
import { revalidateApp } from "./customer";
import { PartT } from "@/lib/types";
import { revalidatePath } from "next/cache";
export interface savePurchaseInvoiceType {
    SupplierId: string;
    date: Date;
    InvoiceItems: {
        id: string;
        quantity: number;
        price: number;
    }[];
    invoiceAmount: number;
    paidAmount: number;
    orgid: string;
}
export interface savepurchaseReturnsInvoiceType {
    SupplierId: string;
    date: Date;
    InvoiceItems: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    invoiceAmount: number;
    paidAmount?: number;
    orgid: string;
}
export interface UpdatePurchaseInvoiceType {
    Id: string;
    SupplierId: string;
    date: Date;
    InvoiceItems: {
        id: string;
        quantity: number;
        price: number;
    }[];
    invoiceAmount: number;
    paidAmount: number;
    orgid: string;
}

export const SavePurchase = async (InvoiceData: savePurchaseInvoiceType) => {
    try {
        const {
            InvoiceItems,
            SupplierId,
            date,
            invoiceAmount,
            paidAmount,
            orgid,
        } = InvoiceData;
        // console.log(orgid);
        if (!orgid) {
            throw new Error("orgid is required");
        }
        if (!SupplierId) {
            throw new Error("Customer Id is required");
        }
        if (!date) {
            throw new Error("date  is required");
        }
        if (!InvoiceItems || InvoiceItems.length < 1) {
            throw new Error("invoice items are empty");
        }
        if (!invoiceAmount || typeof invoiceAmount !== "number") {
            throw new Error("invoiceAmount is required");
        }
        // get all products in the invoice to create line Items later

        const Invoice = await prismaDb.purchaseInvoice.create({
            data: {
                SupplierId: SupplierId,
                date: date,

                lineItems: {
                    createMany: {
                        data: InvoiceItems.map((item, i) => {
                            return {
                                ItemNumber: i + 1,
                                productId: item.id,
                                quantity: item.quantity,
                                organizationId: orgid,
                                price: item.price,
                            };
                        }),
                    },
                },
                amount: invoiceAmount,

                organizationId: orgid,
            },
            select: {
                lineItems: true,
                number: true,
            },
        });

        revalidatePath("/", "layout");

        return {
            status: "ok",
            message: "invoice saved succesfully",
            data: Invoice,
        };
    } catch (error) {
        // console.log(error);

        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went wrong while saving invoice ",
            data: null,
        };
    }
};

export const UpdatePurchaseInvoice = async (
    InvoiceData: UpdatePurchaseInvoiceType
) => {
    try {
        console.log(InvoiceData);

        const { InvoiceItems, SupplierId, date, invoiceAmount, Id, orgid } =
            InvoiceData;
        if (!orgid) {
            throw new Error("orgid is required");
        }
        if (!Id) {
            throw new Error("invoice Id is required");
        }
        if (!SupplierId) {
            throw new Error("Supplier Id  is required");
        }
        if (!date) {
            throw new Error("date  is required");
        }
        if (!InvoiceItems || InvoiceItems.length < 1) {
            throw new Error("invoice items are empty");
        }
        if (!invoiceAmount) {
            throw new Error("invoiceAmount is required");
        }
        const existingInvoice = await prismaDb.purchaseInvoice.findUnique({
            where: {
                id: Id,
            },
            include: {
                lineItems: true,
            },
        });

        if (!existingInvoice) {
            throw new Error("there is no invoice with the provided Id");
        }

        existingInvoice.lineItems.forEach(async (item) => {
            await prismaDb.lineItem.delete({
                where: {
                    id: item.id,
                },
            });
        });

        console.log(InvoiceItems);

        const Invoice = await prismaDb.purchaseInvoice.update({
            where: {
                id: Id,
            },
            data: {
                SupplierId: SupplierId,
                date: date,
                lineItems: {
                    createMany: {
                        data: InvoiceItems.map((item, i) => {
                            return {
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                amount: item.price * item.quantity,
                                ItemNumber: i + 1,
                                organizationId: orgid,
                            };
                        }),
                    },
                },

                amount: invoiceAmount,
            },
        });

        console.log(Invoice);

        revalidateApp();
        return {
            status: "ok",
            message: "purchase Invoice updated succesfully",
            data: Invoice,
        };
    } catch (error) {
        console.log(error);
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.name
                    : "something went while updating purchase Invoice ",
            data: null,
        };
    }
};

export const DeletePurchaseInvoice = async (Id: string) => {
    try {
        const existingInvoice = await prismaDb.purchaseInvoice.findUnique({
            where: {
                id: Id,
            },
        });

        if (!existingInvoice) {
            throw new Error("there is no invoice with the provided Id");
        }
        // update inventory

        // Delete Invoice
        await prismaDb.purchaseInvoice.delete({
            where: {
                id: Id,
            },
        });

        revalidateApp();
        return {
            status: "ok",
            message: "invoice deleted succesfully",
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went while deleting invoice ",
            data: null,
        };
    }
};

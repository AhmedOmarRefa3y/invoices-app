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
interface UpdatePurchaseInvoiceType {
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
                // payment:
                //     paidAmount && paidAmount > 0.1
                //         ? {
                //               create: {
                //                   amount: paidAmount,
                //                   customer: {
                //                       connect: {
                //                           id: customerId,
                //                       },
                //                   },
                //                   method: "نقدي",
                //                   date: date,
                //                   organization: {
                //                       connect: {
                //                           id: orgid,
                //                       },
                //                   },
                //               },
                //           }
                //         : undefined,
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

// export const UpdateInvoice = async (InvoiceData: UpdateInvoiceType) => {
//     try {
//         const {
//             InvoiceItems,
//             customerId,
//             date,
//             invoiceAmount,
//             paidAmount,
//             Id,
//             orgid,
//         } = InvoiceData;
//         // errors
//         if (!orgid) {
//             throw new Error("orgid is required");
//         }
//         if (!Id) {
//             throw new Error("invoice Id is required");
//         }
//         if (!customerId) {
//             throw new Error("Customer Id is required");
//         }
//         if (!date) {
//             throw new Error("date  is required");
//         }
//         if (!InvoiceItems || InvoiceItems.length < 1) {
//             throw new Error("invoice items are empty");
//         }
//         if (!invoiceAmount) {
//             throw new Error("invoiceAmount is required");
//         }
//         // get existing Invoice from db
//         const existingInvoice = await prismaDb.invoice.findUnique({
//             where: {
//                 id: Id,
//             },
//             include: {
//                 customer: true,
//                 orders: true,
//                 lineItems: true,
//                 payment: true,
//             },
//         });

//         if (!existingInvoice) {
//             throw new Error("there is no invoice with the provided Id");
//         }
//         // update inventory (decrement)

//         // delete invoice lineItems
//         existingInvoice?.lineItems.forEach(async (item) => {
//             await prismaDb.lineItem.delete({
//                 where: {
//                     id: item.id,
//                 },
//             });
//         });
//         // delete invoice orders
//         existingInvoice?.orders.forEach(async (item) => {
//             await prismaDb.orderItem.delete({
//                 where: {
//                     id: item.id,
//                 },
//             });
//         });
//         // delete invoice  payemnt
//         if (existingInvoice.payment) {
//             await prismaDb.payment.delete({
//                 where: {
//                     invoiceId: existingInvoice?.id,
//                 },
//             });
//             // console.log(deletedPayment);
//         }

//         // get all products in the invoice to create line Items later
//         const items = await Promise.all(
//             InvoiceItems.map(async (item) => {
//                 const Prod = await prismaDb.product.findUnique({
//                     where: {
//                         id: item.id,
//                         organizationId: orgid,
//                     },
//                     include: {
//                         Part: true,
//                     },
//                 });
//                 if (Prod) {
//                     return {
//                         id: Prod.id,
//                         parts: Prod.Part,
//                         quantity: item.quantity,
//                     };
//                 }
//             })
//         );
//         // console.log(items);

//         const Lineitems: { id: string; quantity: number }[] = [];
//         items.forEach((item) => {
//             if (item) {
//                 if (item.parts.length < 1) {
//                     const isItemAlreadyThere = Lineitems.find(
//                         (lineItem) => lineItem.id == item.id
//                     );

//                     if (isItemAlreadyThere) {
//                         Lineitems.forEach((lineItem) => {
//                             if (lineItem.id == item.id) {
//                                 lineItem.quantity += item.quantity;
//                             }
//                         });
//                     } else {
//                         Lineitems.push({
//                             id: item.id,
//                             quantity: item.quantity,
//                         });
//                     }
//                 } else {
//                     item.parts.forEach((part) => {
//                         const isItemAlreadyThere = Lineitems.find(
//                             (lineItem) => lineItem.id == part.partProductId
//                         );
//                         if (isItemAlreadyThere) {
//                             Lineitems.forEach((lineItem) => {
//                                 if (lineItem.id == part.partProductId) {
//                                     lineItem.quantity +=
//                                         part.quantity * item.quantity;
//                                 }
//                             });
//                         } else {
//                             if (part.partProductId) {
//                                 Lineitems.push({
//                                     id: part.partProductId,
//                                     quantity: part.quantity * item.quantity,
//                                 });
//                             }
//                         }
//                     });
//                 }
//             }
//         });
//         // console.log(Lineitems);

//         // update invoice
//         const Invoice = await prismaDb.invoice.update({
//             where: {
//                 id: Id,
//             },
//             data: {
//                 customerId: customerId,
//                 date: date,
//                 orders: {
//                     createMany: {
//                         data: InvoiceItems.map((item, i) => {
//                             // console.log(item);
//                             return {
//                                 productId: item.id,
//                                 quantity: item.quantity,
//                                 price: item.price,
//                                 amount: item.price * item.quantity,
//                                 OrderNumber: i + 1,
//                                 organizationId: orgid,
//                             };
//                         }),
//                     },
//                 },
//                 lineItems: {
//                     createMany: {
//                         data: Lineitems.map((item, i) => {
//                             return {
//                                 ItemNumber: i + 1,
//                                 productId: item.id,
//                                 quantity: item.quantity,
//                                 organizationId: orgid,
//                             };
//                         }),
//                     },
//                 },
//                 amount: invoiceAmount,
//                 payment:
//                     paidAmount && paidAmount > 0.1
//                         ? {
//                               create: {
//                                   amount: paidAmount,
//                                   customer: {
//                                       connect: {
//                                           id: customerId,
//                                       },
//                                   },
//                                   method: "نقدي",
//                                   date: date,
//                                   organizationId: orgid,
//                               } as any,
//                           }
//                         : undefined,
//             },
//             include: {
//                 lineItems: true,
//             },
//         });
//         // update inventory (increment)

//         revalidateApp();
//         return {
//             status: "ok",
//             message: "invoice updated succesfully",
//             data: Invoice,
//         };
//     } catch (error) {
//         // console.log(error);
//         return {
//             status: "error",
//             message:
//                 error instanceof Error
//                     ? error.name
//                     : "something went while updating invoice ",
//             data: null,
//         };
//     }
// };

// export const DeleteInvoice = async (Id: string) => {
//     try {
//         const existingInvoice = await prismaDb.invoice.findUnique({
//             where: {
//                 id: Id,
//             },
//             include: {
//                 customer: true,
//                 lineItems: true,
//             },
//         });

//         if (!existingInvoice) {
//             throw new Error("there is no invoice with the provided Id");
//         }
//         // update inventory

//         // Delete Invoice
//         await prismaDb.invoice.delete({
//             where: {
//                 id: Id,
//             },
//         });

//         revalidateApp();
//         return {
//             status: "ok",
//             message: "invoice deleted succesfully",
//         };
//     } catch (error) {
//         return {
//             status: "error",
//             message:
//                 error instanceof Error
//                     ? error.message
//                     : "something went while deleting invoice ",
//             data: null,
//         };
//     }
// };

// export const SaveReturnedInvoice = async (InvoiceData: saveREtInvoiceType) => {
//     try {
//         const { InvoiceItems, customerId, date, invoiceAmount, orgid } =
//             InvoiceData;
//         if (!orgid) {
//             throw new Error("orgid  is required");
//         }
//         if (!customerId) {
//             throw new Error("Customer Id is required");
//         }
//         if (!date) {
//             throw new Error("date  is required");
//         }
//         if (!InvoiceItems || InvoiceItems.length < 1) {
//             throw new Error("invoice items are empty");
//         }
//         if (!invoiceAmount || typeof invoiceAmount !== "number") {
//             throw new Error("invoiceAmount is required");
//         }

//         const items = await Promise.all(
//             InvoiceItems.map(async (item) => {
//                 const Prod = await prismaDb.product.findUnique({
//                     where: {
//                         id: item.productId,
//                         organizationId: orgid,
//                     },
//                     include: {
//                         Part: true,
//                     },
//                 });
//                 if (Prod) {
//                     return {
//                         id: Prod.id,
//                         parts: Prod.Part,
//                         quantity: item.quantity,
//                     };
//                 }
//             })
//         );

//         const Lineitems: { id: string; quantity: number }[] = [];
//         items.forEach((item) => {
//             if (item) {
//                 if (item.parts.length < 1) {
//                     const isItemAlreadyThere = Lineitems.find(
//                         (lineItem) => lineItem.id == item.id
//                     );

//                     if (isItemAlreadyThere) {
//                         Lineitems.forEach((lineItem) => {
//                             if (lineItem.id == item.id) {
//                                 lineItem.quantity += item.quantity;
//                             }
//                         });
//                     } else {
//                         Lineitems.push({
//                             id: item.id,
//                             quantity: item.quantity,
//                         });
//                     }
//                 } else {
//                     item.parts.forEach((part) => {
//                         const isItemAlreadyThere = Lineitems.find(
//                             (lineItem) => lineItem.id == part.partProductId
//                         );
//                         if (isItemAlreadyThere) {
//                             Lineitems.forEach((lineItem) => {
//                                 if (lineItem.id == part.partProductId) {
//                                     lineItem.quantity +=
//                                         part.quantity * item.quantity;
//                                 }
//                             });
//                         } else {
//                             if (part.partProductId) {
//                                 Lineitems.push({
//                                     id: part.partProductId,
//                                     quantity: part.quantity * item.quantity,
//                                 });
//                             }
//                         }
//                     });
//                 }
//             }
//         });
//         const ReturnedInvoice = await prismaDb.returnedInvoice.create({
//             data: {
//                 customerId: customerId,
//                 date: date,
//                 orders: {
//                     createMany: {
//                         data: InvoiceItems.map((item, i) => {
//                             // console.log(item);
//                             return {
//                                 productId: item.productId,
//                                 quantity: item.quantity,
//                                 price: item.price,
//                                 amount: item.price * item.quantity,
//                                 organizationId: orgid,
//                             };
//                         }),
//                     },
//                 },
//                 lineItems: {
//                     createMany: {
//                         data: Lineitems.map((item) => {
//                             return {
//                                 productId: item.id,
//                                 quantity: item.quantity,
//                                 organizationId: orgid,
//                             };
//                         }),
//                     },
//                 },
//                 amount: invoiceAmount,
//                 organizationId: orgid,
//             },
//         });

//         revalidateApp();
//         return {
//             status: "ok",
//             message: "ReturnedInvoice saved succesfully",
//             data: ReturnedInvoice,
//         };
//     } catch (error) {
//         return {
//             status: "error",
//             message:
//                 error instanceof Error
//                     ? error.message
//                     : "something went wrong while saving ReturnedInvoice ",
//             data: null,
//         };
//     }
// };

// export const DeleteReturnedInvoice = async (Id: string) => {
//     try {
//         const existingInvoice = await prismaDb.returnedInvoice.findUnique({
//             where: {
//                 id: Id,
//             },
//             include: {
//                 customer: true,
//                 lineItems: true,
//             },
//         });

//         if (!existingInvoice) {
//             throw new Error("there is no invoice with the provided Id");
//         }
//         // update inventory

//         if (!Id) {
//             throw new Error("Id is required");
//         }
//         await prismaDb.returnedInvoice.delete({
//             where: {
//                 id: Id,
//             },
//         });

//         revalidateApp();
//         return {
//             status: "ok",
//             message: "Returned Invoice deleted succesfully",
//         };
//     } catch (error) {
//         return {
//             status: "error",
//             message:
//                 error instanceof Error
//                     ? error.message
//                     : "something went while deleting Returned Invoice ",
//             data: null,
//         };
//     }
// };

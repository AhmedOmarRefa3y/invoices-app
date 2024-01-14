"use server";

import prismaDb from "@/lib/prisma";
import { revalidateApp } from "./customer";

const year = 2024;
export interface saveInvoiceType {
    customerId: string;
    date: Date;
    InvoiceItems: {
        id: string;
        quantity: number;
        price: number;
    }[];
    invoiceAmount: number;
    paidAmount: number;
}
export interface saveREtInvoiceType {
    customerId: string;
    date: Date;
    InvoiceItems: {
        id: string;
        quantity: number;
        price: number;
    }[];
    invoiceAmount: number;
    paidAmount?: number;
}
interface UpdateInvoiceType {
    Id: string;
    customerId: string;
    date: Date;
    InvoiceItems: {
        id: string;
        quantity: number;
        price: number;
    }[];
    invoiceAmount: number;
    paidAmount: number;
}
export const SaveInvoice = async (InvoiceData: saveInvoiceType) => {
    try {
        const { InvoiceItems, customerId, date, invoiceAmount, paidAmount } =
            InvoiceData;
        if (!customerId) {
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

        
        const Invoice = await prismaDb.invoice.create({
            data: {
                customerId: customerId,
                date: date,
                lineItems: {
                    createMany: {
                        data: InvoiceItems.map((item, i) => {
                            return {
                                ItemNumber: i + 1,
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                amount: item.price * item.quantity,
                            };
                        }),
                    },
                },
                amount: invoiceAmount,
                payment:
                    paidAmount && paidAmount > 0.1
                        ? {
                              create: {
                                  amount: paidAmount,
                                  customer: {
                                      connect: {
                                          id: customerId,
                                      },
                                  },
                                  method: "نقدي",
                                  date: date,
                              },
                          }
                        : undefined,
            },
        });
        InvoiceItems.forEach(async (item) => {
            const inventory = await prismaDb.inventoryRecord.findFirst({
                where: {
                    productId: item.id,
                    year: year,
                },
            });

            await prismaDb.inventoryRecord.update({
                where: {
                    id: inventory?.id,
                },
                data: {
                    IssuedQuantity: {
                        increment: item.quantity,
                    },
                },
            });
        });
        revalidateApp();
        return {
            status: "ok",
            message: "invoice saved succesfully",
            data: Invoice,
        };
    } catch (error) {
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

export const UpdateInvoice = async (InvoiceData: UpdateInvoiceType) => {
    try {
        const {
            InvoiceItems,
            customerId,
            date,
            invoiceAmount,
            paidAmount,
            Id,
        } = InvoiceData;
        if (!Id) {
            throw new Error("invoice Id is required");
        }
        if (!customerId) {
            throw new Error("Customer Id is required");
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

        const existingInvoice = await prismaDb.invoice.findUnique({
            where: {
                id: Id,
            },
            include: {
                customer: true,
                lineItems: true,
                payment: true,
            },
        });

        if (!existingInvoice) {
            throw new Error("there is no invoice with the provided Id");
        }
        // update inventory
        existingInvoice?.lineItems.forEach(async (item) => {
            const inventory = await prismaDb.inventoryRecord.findFirst({
                where: {
                    productId: item.productId,
                    year: year,
                },
            });
            console.log(inventory);

            const updateinventory = await prismaDb.inventoryRecord.update({
                where: {
                    id: inventory?.id,
                },
                data: {
                    IssuedQuantity: {
                        decrement: item.quantity,
                    },
                },
            });
            console.log(updateinventory);
        });

        existingInvoice?.lineItems.forEach(async (item) => {
            await prismaDb.lineItem.delete({
                where: {
                    id: item.id,
                },
            });
        });

        if (existingInvoice.payment) {
            const deletedPayment = await prismaDb.payment.delete({
                where: {
                    invoiceId: existingInvoice?.id,
                },
            });
            console.log(deletedPayment);
        }

        const Invoice = await prismaDb.invoice.update({
            where: {
                id: Id,
            },
            data: {
                customerId: customerId,
                date: date,
                lineItems: {
                    createMany: {
                        data: InvoiceItems.map((item, i) => {
                            return {
                                ItemNumber: i + 1,
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                amount: item.price * item.quantity,
                            };
                        }),
                    },
                },
                amount: invoiceAmount,
                payment:
                    paidAmount && paidAmount > 0.1
                        ? {
                              create: {
                                  amount: paidAmount,
                                  customer: {
                                      connect: {
                                          id: customerId,
                                      },
                                  },
                                  method: "نقدي",
                                  date: date,
                              },
                          }
                        : undefined,
            },
            include: {
                lineItems: true,
            },
        });
        // update inventory
        InvoiceItems.forEach(async (item) => {
            const inventory = await prismaDb.inventoryRecord.findFirst({
                where: {
                    productId: item.id,
                    year: year,
                },
            });

            await prismaDb.inventoryRecord.update({
                where: {
                    id: inventory?.id,
                },
                data: {
                    IssuedQuantity: {
                        increment: item.quantity,
                    },
                },
            });
        });
        revalidateApp();
        return {
            status: "ok",
            message: "invoice updated succesfully",
            data: Invoice,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went while updating invoice ",
            data: null,
        };
    }
};

export const DeleteInvoice = async (Id: string) => {
    try {
        const existingInvoice = await prismaDb.invoice.findUnique({
            where: {
                id: Id,
            },
            include: {
                customer: true,
                lineItems: true,
            },
        });

        if (!existingInvoice) {
            throw new Error("there is no invoice with the provided Id");
        }
        // update inventory
        existingInvoice?.lineItems.forEach(async (item) => {
            const inventory = await prismaDb.inventoryRecord.findFirst({
                where: {
                    productId: item.productId,
                    year: year,
                },
            });
            console.log(inventory);

            const updateinventory = await prismaDb.inventoryRecord.update({
                where: {
                    id: inventory?.id,
                },
                data: {
                    IssuedQuantity: {
                        decrement: item.quantity,
                    },
                },
            });
            console.log(updateinventory);
        });

        if (!Id) {
            throw new Error("Id is required");
        }
        await prismaDb.invoice.delete({
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

export const SaveReturnedInvoice = async (InvoiceData: saveREtInvoiceType) => {
    try {
        const { InvoiceItems, customerId, date, invoiceAmount, paidAmount } =
            InvoiceData;
        if (!customerId) {
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
        const ReturnedInvoice = await prismaDb.returnedInvoice.create({
            data: {
                customerId: customerId,
                date: date,
                lineItems: {
                    createMany: {
                        data: InvoiceItems.map((item, i) => {
                            return {
                                ItemNumber: i + 1,
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                amount: item.price * item.quantity,
                            };
                        }),
                    },
                },
                amount: invoiceAmount,
            },
        });
        // update inventory
        InvoiceItems.forEach(async (item) => {
            const inventory = await prismaDb.inventoryRecord.findFirst({
                where: {
                    productId: item.id,
                    year: year,
                },
            });

            await prismaDb.inventoryRecord.update({
                where: {
                    id: inventory?.id,
                },
                data: {
                    ReceivedQuantity: {
                        increment: item.quantity,
                    },
                },
            });
        });

        revalidateApp();
        return {
            status: "ok",
            message: "ReturnedInvoice saved succesfully",
            data: ReturnedInvoice,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went wrong while saving ReturnedInvoice ",
            data: null,
        };
    }
};

export const DeleteReturnedInvoice = async (Id: string) => {
    try {
        const existingInvoice = await prismaDb.returnedInvoice.findUnique({
            where: {
                id: Id,
            },
            include: {
                customer: true,
                lineItems: true,
            },
        });

        if (!existingInvoice) {
            throw new Error("there is no invoice with the provided Id");
        }
        // update inventory
        existingInvoice?.lineItems.forEach(async (item) => {
            const inventory = await prismaDb.inventoryRecord.findFirst({
                where: {
                    productId: item.productId,
                    year: year,
                },
            });

            const updateinventory = await prismaDb.inventoryRecord.update({
                where: {
                    id: inventory?.id,
                },
                data: {
                    ReceivedQuantity: {
                        decrement: item.quantity,
                    },
                },
            });
        });

        if (!Id) {
            throw new Error("Id is required");
        }
        await prismaDb.returnedInvoice.delete({
            where: {
                id: Id,
            },
        });

        revalidateApp();
        return {
            status: "ok",
            message: "Returned Invoice deleted succesfully",
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went while deleting Returned Invoice ",
            data: null,
        };
    }
};

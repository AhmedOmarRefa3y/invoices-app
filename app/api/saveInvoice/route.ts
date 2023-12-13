import prismaDb from "@/lib/prisma";
import { NextApiResponse } from "next";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
    try {
        const body = await req.json();
        const InvoiceInfo: {
            InvoiceItems: {
                id: string;
                name: string;
                price: number;
                quantity: number;
            }[];
            date: Date;
            customerId: string;
            paidAmount: number;
            InvoiceId: string;
            invoiceAmount: number;
        } = body;

        console.log(InvoiceInfo.InvoiceId);

        if (!InvoiceInfo) {
            return new NextResponse("Invoice is required", { status: 401 });
        }

        const existingInvoice = await prismaDb.invoice.findUnique({
            where: {
                id: InvoiceInfo.InvoiceId ? InvoiceInfo.InvoiceId : "",
            },
            include: {
                customer: true,
                lineItems: true,
                payment: true,
            },
        });

        if (existingInvoice) {
            const updatedLineItems = await Promise.all(
                existingInvoice.lineItems.map(async (existingLineItem) => {
                    const matchingItem = InvoiceInfo.InvoiceItems.find(
                        (item) => item.id === existingLineItem.productId
                    );

                    if (matchingItem) {
                        // If the item exists in the new list, update its quantity
                        return prismaDb.lineItem.update({
                            where: { id: existingLineItem.id },
                            data: {
                                quantity: matchingItem.quantity,
                                amount:
                                    matchingItem.quantity * matchingItem.price,
                            },
                        });
                    } else {
                        // If the item doesn't exist in the new list, delete it from the invoice
                        return prismaDb.lineItem.delete({
                            where: { id: existingLineItem.id },
                        });
                    }
                })
            );

            // Create new line items for items not present in the existing invoice
            const newLineItems = await Promise.all(
                InvoiceInfo.InvoiceItems.filter(
                    (item) =>
                        !existingInvoice.lineItems.some(
                            (lineItem) => lineItem.productId === item.id
                        )
                ).map(async (item) => {
                    return prismaDb.lineItem.create({
                        data: {
                            quantity: item.quantity,
                            product: {
                                connect: { id: item.id },
                            },
                            invoice: {
                                connect: { id: existingInvoice.id },
                            },
                            amount: item.quantity * item.price,
                        },
                    });
                })
            );
            console.log("updated items");

            // return NextResponse.json({ updatedLineItems, newLineItems });
        }

        if (InvoiceInfo.InvoiceId) {
            const Invoice = await prismaDb.invoice.update({
                where: {
                    id: InvoiceInfo.InvoiceId,
                },
                data: {
                    customerId: InvoiceInfo.customerId,
                    date: InvoiceInfo.date,
                    amount: InvoiceInfo.invoiceAmount,
                    payment:
                        existingInvoice?.payment && InvoiceInfo.paidAmount > 0
                            ? {
                                  update: {
                                      amount: InvoiceInfo.paidAmount,
                                      customer: {
                                          connect: {
                                              id: InvoiceInfo.customerId,
                                          },
                                      },
                                  },
                              }
                            : existingInvoice?.payment &&
                              InvoiceInfo.paidAmount <= 0
                            ? {
                                  delete: existingInvoice?.payment,
                              }
                            : !existingInvoice?.payment &&
                              InvoiceInfo.paidAmount > 0
                            ? {
                                  create: {
                                      amount: InvoiceInfo.paidAmount,
                                      customer: {
                                          connect: {
                                              id: InvoiceInfo.customerId,
                                          },
                                      },
                                      method: "نقدي",
                                      type: "سداد",
                                  },
                              }
                            : undefined,
                },
                include: {
                    customer: true,
                    lineItems: true,
                    payment: true,
                },
            });
            console.log("updated invoice wth payment");

            return NextResponse.json({ Invoice });
        }

        if (InvoiceInfo.paidAmount && !InvoiceInfo.InvoiceId) {
            const Invoice = await prismaDb.invoice.create({
                data: {
                    customerId: InvoiceInfo.customerId,
                    date: InvoiceInfo.date,
                    lineItems: {
                        create: InvoiceInfo.InvoiceItems.map((item) => {
                            return {
                                quantity: item.quantity,
                                product: {
                                    connect: {
                                        id: item.id,
                                    },
                                },
                                amount: item.quantity * item.price,
                            };
                        }),
                    },
                    amount: InvoiceInfo.invoiceAmount,
                    payment: {
                        create: {
                            amount: InvoiceInfo.paidAmount,
                            customer: {
                                connect: {
                                    id: InvoiceInfo.customerId,
                                },
                            },
                            method: "نقدي",
                            type: "سداد",
                        },
                    },
                },
            });
            console.log("creted invoice wth payment");

            return NextResponse.json({ Invoice });
        }
        if (!InvoiceInfo.InvoiceId) {
            const Invoice = await prismaDb.invoice.create({
                data: {
                    customerId: InvoiceInfo.customerId,
                    date: InvoiceInfo.date,
                    lineItems: {
                        create: InvoiceInfo.InvoiceItems.map((item) => {
                            return {
                                quantity: item.quantity,
                                product: {
                                    connect: {
                                        id: item.id,
                                    },
                                },
                                amount: item.quantity * item.price,
                            };
                        }),
                    },
                    amount: InvoiceInfo.invoiceAmount,
                },
                include: {
                    lineItems: true,
                },
            });
            console.log("creted invoice");
            console.log(Invoice);

            InvoiceInfo.InvoiceItems.map(async (item) => {
                const updateInventory = await prismaDb.product.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        Inventory: {
                            update: {
                                quantity: {
                                    decrement: item.quantity,
                                },
                            },
                        },
                    },
                });
                updateInventory;
                console.log("updatedInventory");
            });
            return NextResponse.json({ Invoice });
        }
    } catch (error) {
        console.log(`[stores-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

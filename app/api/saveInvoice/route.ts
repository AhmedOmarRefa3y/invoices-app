import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const InvoiceInfo: {
            items: {
                id: string;
                name: string;
                price: number;
                quantity: number;
            }[];
            date: Date;
            customerId: string;
            paidAmount: number;
            InvoiceId: string;
        } = body;

        console.log(InvoiceInfo.InvoiceId);

        if (!InvoiceInfo) {
            return new NextResponse("Invoice is required", { status: 401 });
        }

        // const productsInfo = [
        //     { name: "Product 1", price: 10.99 },
        //     { name: "Product 2", price: 15.49 },
        //     { name: "Product 3", price: 7.99 },
        //     { name: "Product 4", price: 22.95 },
        //     { name: "Product 5", price: 8.5 },
        //     { name: "Product 6", price: 12.75 },
        //     { name: "Product 7", price: 19.99 },
        //     { name: "Product 8", price: 5.99 },
        //     { name: "Product 9", price: 14.25 },
        //     { name: "Product 10", price: 9.99 },
        // ];

        // const products = await prismaDb.product.createMany({
        //     data: productsInfo,
        // });
        // const customersInfo = [
        //     { name: "Customer 1" },
        //     { name: "Customer 2" },
        //     { name: "Customer 3" },
        //     { name: "Customer 4" },
        //     { name: "Customer 5" },
        //     { name: "Customer 6" },
        //     { name: "Customer 7" },
        //     { name: "Customer 8" },
        //     { name: "Customer 9" },
        //     { name: "Customer 10" },
        // ];

        // const customers = await prismaDb.customer.createMany({
        //     data: customersInfo,
        // });
        // console.log(InvoiceInfo.InvoiceId);

        const existingInvoice = await prismaDb.invoice.findFirst({
            where: {
                id: InvoiceInfo.InvoiceId,
            },
            include: {
                customer: true,
                lineItems: true,
                payment: true,
            },
        });
        // console.log(existingInvoice);
        // return NextResponse.json({ existingInvoice });
        if (existingInvoice) {
            const updatedLineItems = await Promise.all(
                existingInvoice.lineItems.map(async (existingLineItem) => {
                    const matchingItem = InvoiceInfo.items.find(
                        (item) => item.id === existingLineItem.productId
                    );

                    if (matchingItem) {
                        // If the item exists in the new list, update its quantity
                        return prismaDb.lineItem.update({
                            where: { id: existingLineItem.id },
                            data: { quantity: matchingItem.quantity },
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
                InvoiceInfo.items
                    .filter(
                        (item) =>
                            !existingInvoice.lineItems.some(
                                (lineItem) => lineItem.productId === item.id
                            )
                    )
                    .map(async (item) => {
                        return prismaDb.lineItem.create({
                            data: {
                                quantity: item.quantity,
                                product: {
                                    connect: { id: item.id },
                                },
                                invoice: {
                                    connect: { id: existingInvoice.id },
                                },
                            },
                        });
                    })
            );

            // return NextResponse.json({ updatedLineItems, newLineItems });
        }

        if (InvoiceInfo.InvoiceId) {
            const updatedInvoice = await prismaDb.invoice.update({
                where: {
                    id: InvoiceInfo.InvoiceId,
                },
                data: {
                    customerId: InvoiceInfo.customerId,
                    date: InvoiceInfo.date,
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
                                      method: "cash",
                                  },
                              }
                            : undefined,
                    //               ? {
                    //                     id: existingInvoice?.payment?.id,
                    //                 }
                    //               : undefined,

                    // InvoiceInfo.paidAmount > 0
                    //     ? {
                    //           update: {
                    //               amount: InvoiceInfo.paidAmount,
                    //               customer: {
                    //                   connect: {
                    //                       id: InvoiceInfo.customerId,
                    //                   },
                    //               },
                    //           },
                    //       }
                    //     : {
                    //           delete: existingInvoice?.payment
                    //               ? {
                    //                     id: existingInvoice?.payment?.id,
                    //                 }
                    //               : undefined,
                    //       },
                    // lineItems: {
                    //     create: InvoiceInfo.items.map((item) => {
                    //         return {
                    //             quantity: item.quantity,
                    //             product: {
                    //                 connect: {
                    //                     id: item.id,
                    //                 },
                    //             },
                    //         };
                    //     }),
                    // },
                },
                include: {
                    customer: true,
                    lineItems: true,
                    payment: true,
                },
            });
            console.log(updatedInvoice);

            return NextResponse.json({ updatedInvoice });
        }

        if (InvoiceInfo.paidAmount && !InvoiceInfo.InvoiceId) {
            const Invoice = await prismaDb.invoice.create({
                data: {
                    customerId: InvoiceInfo.customerId,
                    date: InvoiceInfo.date,
                    lineItems: {
                        create: InvoiceInfo.items.map((item) => {
                            return {
                                quantity: item.quantity,
                                product: {
                                    connect: {
                                        id: item.id,
                                    },
                                },
                            };
                        }),
                    },
                    payment: {
                        create: {
                            amount: InvoiceInfo.paidAmount,
                            customer: {
                                connect: {
                                    id: InvoiceInfo.customerId,
                                },
                            },
                            method: "chash",
                        },
                    },
                },
            });
            return NextResponse.json({ Invoice });
        }
        if (!InvoiceInfo.InvoiceId) {
            const Invoice = await prismaDb.invoice.create({
                data: {
                    customerId: InvoiceInfo.customerId,
                    date: InvoiceInfo.date,
                    lineItems: {
                        create: InvoiceInfo.items.map((item) => {
                            return {
                                quantity: item.quantity,
                                product: {
                                    connect: {
                                        id: item.id,
                                    },
                                },
                            };
                        }),
                    },
                },
            });
            return NextResponse.json({ Invoice });
        }
    } catch (error) {
        console.log(`[stores-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

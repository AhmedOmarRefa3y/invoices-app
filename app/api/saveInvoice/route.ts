import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
            invoiceAmount: number;
        } = body;

        console.log("New Invoice Data :", InvoiceInfo);

        if (!InvoiceInfo) {
            return new NextResponse("Invoice Data is required", {
                status: 401,
            });
        }

        const Invoice = await prismaDb.invoice.create({
            data: {
                customerId: InvoiceInfo.customerId,
                date: InvoiceInfo.date,
                lineItems: {
                    createMany: {
                        data: InvoiceInfo.InvoiceItems.map((item, i) => {
                            return {
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                amount: item.price * item.quantity,
                                ItemNumber: i + 1,
                            };
                        }),
                    },
                },
                amount: InvoiceInfo.invoiceAmount,
                payment:
                    InvoiceInfo.paidAmount && InvoiceInfo.paidAmount > 0.1
                        ? {
                              create: {
                                  amount: InvoiceInfo.paidAmount,
                                  customer: {
                                      connect: {
                                          id: InvoiceInfo.customerId,
                                      },
                                  },
                                  method: "نقدي",
                                  date: InvoiceInfo.date,
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

        console.log(Invoice.lineItems);

        return NextResponse.json({ Invoice });
    } catch (error) {
        console.log(`[saveInvoice-Post]`, error);
        return new NextResponse("[saveInvoice-Post]", { status: 500 });
    }
}

export async function PUT(req: Request) {
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

        console.log("Update Invoice Date :", InvoiceInfo);

        if (!InvoiceInfo) {
            return new NextResponse("Invoice Data is required", {
                status: 401,
            });
        }

        const existingInvoice = await prismaDb.invoice.findUnique({
            where: {
                id: InvoiceInfo.InvoiceId,
            },
            include: {
                customer: true,
                lineItems: true,
                payment: true,
            },
        });

        if (!existingInvoice) {
            return new NextResponse("there is no invoice with this Id", {
                status: 401,
            });
        }

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

        const updatedInvoice = await prismaDb.invoice.update({
            where: {
                id: existingInvoice.id,
            },
            data: {
                amount: InvoiceInfo.invoiceAmount,
                customerId: InvoiceInfo.customerId,
                date: InvoiceInfo.date,
                payment:
                    InvoiceInfo.paidAmount && InvoiceInfo.paidAmount > 0.1
                        ? {
                              create: {
                                  amount: InvoiceInfo.paidAmount,
                                  customer: {
                                      connect: {
                                          id: InvoiceInfo.customerId,
                                      },
                                  },
                                  method: "نقدي",
                                  date: InvoiceInfo.date,
                              },
                          }
                        : undefined,
                lineItems: {
                    createMany: {
                        data: InvoiceInfo.InvoiceItems.map((item, i) => {
                            return {
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                amount: item.price * item.quantity,
                                ItemNumber: i + 1,
                            };
                        }),
                    },
                },
            },
        });

        console.log("Updated Invoice", updatedInvoice);

        return NextResponse.json({ updatedInvoice });
    } catch (error) {
        console.log(`[UpadteInvoice-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

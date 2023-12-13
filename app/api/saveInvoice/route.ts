import prismaDb from "@/lib/prisma";
import { NextApiResponse } from "next";
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
            invoiceAmount: number;
        } = body;

        console.log("New Invoice Date :", InvoiceInfo);

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
                    create: InvoiceInfo.InvoiceItems.map((item) => {
                        return {
                            quantity: item.quantity,
                            product: {
                                connect: {
                                    id: item.id,
                                },
                            },
                            price: item.price,
                            amount: item.quantity * item.price,
                        };
                    }),
                },
                amount: InvoiceInfo.invoiceAmount,
                payment:
                    InvoiceInfo.paidAmount > 1
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
                        : {},
            },
            include: {
                customer: true,
                lineItems: true,
                payment: true,
            },
        });
        console.log(Invoice);

        return NextResponse.json({ Invoice });
    } catch (error) {
        console.log(`[saveInvoice-Post]`, error);
        return new NextResponse("[saveInvoice-Post]", { status: 500 });
    }
}

export async function PUT(req: Request, res: NextApiResponse) {
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

        existingInvoice?.lineItems.forEach(async (item) => {
            await prismaDb.lineItem.delete({
                where: {
                    id: item.id,
                },
            });
        });
        if (!existingInvoice) {
            return new NextResponse("there is no invoice", { status: 401 });
        }
        if (existingInvoice) {
            const updateData = {
                amount: InvoiceInfo.invoiceAmount,
                customerId: InvoiceInfo.customerId,
                date: InvoiceInfo.date,
                payment: {},
                lineItems: {
                    createMany: {
                        data: InvoiceInfo.InvoiceItems.map((item) => {
                            return {
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                amount: item.price * item.quantity,
                            };
                        }),
                    },
                },
            };

            if (existingInvoice.payment) {
                // If payment exists, update the payment
                updateData.payment = {
                    update: {
                        amount: InvoiceInfo.paidAmount,
                    },
                };
            } else {
                // If payment doesn't exist, create a new payment
                updateData.payment = {
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
                };
            }

            const updatedInvoice = await prismaDb.invoice.update({
                where: {
                    id: existingInvoice.id,
                },
                data: updateData,
            });
            updatedInvoice;
            console.log(updatedInvoice);

            return NextResponse.json({ updatedInvoice });
        }
    } catch (error) {
        console.log(`[UpadteInvoice-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

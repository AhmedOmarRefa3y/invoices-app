import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const returnedInvoiceDATA: {
            InvoiceInfo: {
                date: Date;
                Items: {
                    productId: string;
                    quantity: number;
                    price: number;
                }[];
                customerId: string;
                amount: number;
            };
            InvoiceId: string;
        } = body;
        const NEWreturnedInvoice = await prismaDb.returnedInvoice.create({
            data: {
                customer: {
                    connect: {
                        id: returnedInvoiceDATA.InvoiceInfo.customerId,
                    },
                },
                date: returnedInvoiceDATA.InvoiceInfo.date,
                lineItems: {
                    createMany: {
                        data: returnedInvoiceDATA.InvoiceInfo.Items.map(
                            (item) => {
                                return {
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    amount: item.quantity * item.price,
                                    price: item.price,
                                };
                            }
                        ),
                    },
                },
                amount: returnedInvoiceDATA.InvoiceInfo.amount,
            },
        });

        console.log(NEWreturnedInvoice);

        return NextResponse.json(NEWreturnedInvoice);
    } catch (error) {
        console.log(`[productionEvent-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const paymentload: {
            CustomerId: string;
            amount: number;
            PaymentType: string;
            Method: string;
            Note: string;
            PaymentId: string | undefined;
        } = body;
        console.log(body);

        if (!paymentload.CustomerId) {
            return new NextResponse("CustomerId is required", {
                status: 401,
            });
        }
        if (!paymentload.amount || paymentload.amount < 1) {
            return new NextResponse("amount is required", {
                status: 401,
            });
        }

        const payment = await prismaDb.payment.create({
            data: {
                amount: paymentload.amount,
                customer: {
                    connect: {
                        id: paymentload.CustomerId,
                    },
                },
                method: paymentload.Method,
                notes: paymentload.Note,
                type: paymentload.PaymentType,
            },
        });

        return NextResponse.json(payment);
    } catch (error) {
        console.log(`[addCustomer-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

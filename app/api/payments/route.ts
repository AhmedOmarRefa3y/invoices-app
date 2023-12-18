import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const paymentload: {
            CustomerId: string;
            amount: number;
            Method: string;
            Note: string;
            PaymentId: string | undefined;
            PaymentDate: Date;
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
                date: paymentload.PaymentDate,
                customer: {
                    connect: {
                        id: paymentload.CustomerId,
                    },
                },
                method: paymentload.Method,
                notes: paymentload.Note,
            },
        });
        console.log(payment);
        return NextResponse.json(payment);
    } catch (error) {
        console.log(`[addCustomer-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const paymentload: {
            CustomerId: string;
            amount: number;
            Method: string;
            Note: string;
            PaymentId: string | undefined;
            PaymentDate: Date;
        } = body;
        console.log(body);

        if (!paymentload.PaymentId) {
            return new NextResponse("PaymentId is required", {
                status: 401,
            });
        }
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

        const UpdatePayment = await prismaDb.payment.update({
            where: {
                id: paymentload.PaymentId,
            },
            data: {
                amount: paymentload.amount,
                date: paymentload.PaymentDate,
                customer: {
                    connect: {
                        id: paymentload.CustomerId,
                    },
                },
                method: paymentload.Method,
                notes: paymentload.Note,
            },
        });
        console.log(UpdatePayment);
        return NextResponse.json(UpdatePayment);
    } catch (error) {
        console.log(`[UpdatePayment-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const PaymentData: {
            id: string;
        } = body;
        console.log(PaymentData);
        if (!PaymentData.id) {
            return new NextResponse("id is required", {
                status: 401,
            });
        }

        const DeletePayment = await prismaDb.payment.delete({
            where: {
                id: PaymentData.id,
            },
        });

        console.log(DeletePayment);

        return NextResponse.json(DeletePayment);
    } catch (error) {
        return new NextResponse("DeletePayment error", { status: 500 });
    }
}

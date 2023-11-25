import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const paymentload: {
            CustomerId: string;
            amount: number;
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
                method: "cash",
            },
        });
        console.log(payment);

        return NextResponse.json(payment);

        // const updateInventoryitems = async () => {
        //     const invoices = await prismaDb.invoice.findMany({
        //         include: {
        //             lineItems: true,
        //         },
        //     });
        //     const lineitems = invoices.map((inv) => inv.lineItems);
        //     console.log(lineitems);
        //     lineitems.forEach((itemsCollection) => {
        //         itemsCollection.forEach(async (collection) => {
        //             const invItem = await prismaDb.inventory.findFirst({
        //                 where: {
        //                     productId: collection.productId,
        //                 },
        //             });
        //             console.log(invItem);

        //             if (invItem) {
        //                 await prismaDb.inventory.update({
        //                     where: {
        //                         id: invItem.id,
        //                     },
        //                     data: {
        //                         quantity: {
        //                             increment: collection.quantity,
        //                         },
        //                     },
        //                 });
        //             }
        //         });
        //     });
        // };
        // updateInventoryitems();
    } catch (error) {
        console.log(`[addCustomer-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

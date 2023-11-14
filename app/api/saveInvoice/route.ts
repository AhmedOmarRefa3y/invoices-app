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
        } = body;

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
                Payment: {
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
    } catch (error) {
        console.log(`[stores-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

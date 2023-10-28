import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { InvoiceInfo } = body;

        // if (!InvoiceInfo) {
        //     return new NextResponse("Invoice is required", { status: 401 });
        // }

        const Invoice = await prismaDb.invoice.create({
            data: {
                customerId: InvoiceInfo.customerId,
                date: InvoiceInfo.date,
                lineItems: InvoiceInfo.items,
            },
        });

        return NextResponse.json(Invoice);
    } catch (error) {
        console.log(`[stores-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

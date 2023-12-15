import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const customerInfo: {
            customerName: string;
            phoneNumber: number;
            location: string;
        } = body;

        if (!customerInfo.customerName) {
            return new NextResponse("customer Name is required", {
                status: 401,
            });
        }

        const customer = await prismaDb.customer.create({
            data: {
                name: customerInfo.customerName,
                phoneNumber: customerInfo.phoneNumber.toString(),
                location: customerInfo.location,
            },
        });
        console.log(customer);

        return NextResponse.json(customer);
    } catch (error) {
        console.log(`[addCustomer-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

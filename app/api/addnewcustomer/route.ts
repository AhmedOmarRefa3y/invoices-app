import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const customerInfo: {
            name: string;
            phoneNumber: string;
            location: string;
            CustomerCredit: number;
        } = body;
        console.log(body);

        if (!customerInfo.name) {
            return new NextResponse("customer Name is required", {
                status: 401,
            });
        }

        const customer = await prismaDb.customer.create({
            data: {
                name: customerInfo.name,
                phoneNumber: customerInfo.phoneNumber || undefined,
                location: customerInfo.location || undefined,
                CustomerCredit: customerInfo.CustomerCredit || undefined,
            },
        });

        console.log(customer);

        return NextResponse.json(customer);
    } catch (error) {
        console.log(`[addCustomer-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const CustomerData: {
            id: string;
        } = body;
        console.log(CustomerData);
        if (!CustomerData.id) {
            return new NextResponse("id is required", {
                status: 401,
            });
        }

        const DeleteCustomer = await prismaDb.customer.delete({
            where: {
                id: CustomerData.id,
            },
        });

        console.log(DeleteCustomer);

        return NextResponse.json(DeleteCustomer);
    } catch (error) {
        return new NextResponse("DeleteCustomer error", { status: 500 });
    }
}

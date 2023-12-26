"use server";
import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function UpdateCustomer(Data: {
    id: string | undefined;
    customerName: string;
    location?: string | undefined;
    phoneNumber?: string | undefined;
    OpenCredit?: number | undefined;
}) {
    try {
        const UpdateCustomer = await prismaDb.customer.update({
            where: {
                id: Data.id,
            },
            data: {
                CustomerCredit: Data.OpenCredit || 0,
                name: Data.customerName,
                location: Data.location,
                phoneNumber: Data.phoneNumber?.toString(),
            },
        });
        console.log("Updated Customer", UpdateCustomer);
        return UpdateCustomer;
    } catch (error) {
        return error;
    }
}

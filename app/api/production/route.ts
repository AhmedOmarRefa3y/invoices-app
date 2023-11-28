import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const productionload: {
            prdouctID: string;
            quantity: number;
        } = body;
        console.log(body);

        if (!productionload.prdouctID) {
            return new NextResponse("prdouctID is required", {
                status: 401,
            });
        }
        if (!productionload.quantity || productionload.quantity < 1) {
            return new NextResponse("quantity is required", {
                status: 401,
            });
        }

        const productionEvent = await prismaDb.productionEvent.create({
            data: {
                product: {
                    connect: {
                        id: productionload.prdouctID,
                    },
                },
                quantity: productionload.quantity,
                Inventory: {
                    connect: {
                        productId: productionload.prdouctID,
                    },
                },
            },
        });

        const updateInventory = await prismaDb.inventory.update({
            where: {
                productId: productionload.prdouctID,
            },
            data: {
                quantity: {
                    increment: productionload.quantity,
                },
            },
        });

        console.log(productionEvent, updateInventory);

        return NextResponse.json(productionEvent);
    } catch (error) {
        console.log(`[productionEvent-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

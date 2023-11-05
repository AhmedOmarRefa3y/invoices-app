import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const productInfo: {
            productName: string;
            price: number;
        } = body;

        if (!productInfo.productName) {
            return new NextResponse("product name is required", {
                status: 401,
            });
        }
        if (!productInfo.price) {
            return new NextResponse("product price is required", {
                status: 401,
            });
        }

        const product = await prismaDb.product.create({
            data: {
                name: productInfo.productName,
                price: productInfo.price,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log(`[add Product-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

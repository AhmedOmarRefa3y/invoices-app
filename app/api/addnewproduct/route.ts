import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const productInfo: {
            productName: string;
            price: number;
            productId: string;
        } = body;
        console.log(productInfo);

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
        if (productInfo.productId) {
            const updatedProduct = await prismaDb.product.update({
                where: {
                    id: productInfo.productId,
                },
                data: {
                    name: productInfo.productName,
                    price: productInfo.price,
                },
            });
            return NextResponse.json(updatedProduct);
        } else {
            const newProduct = await prismaDb.product.create({
                data: {
                    name: productInfo.productName,
                    price: productInfo.price,
                },
            });
            return NextResponse.json(newProduct);
        }
    } catch (error) {
        console.log(`[add Product-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

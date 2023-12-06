import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const productInfo: {
            productName: string;
            price: number;
            productId: string;
            parts: {
                name: string;
                quantity: number;
            }[];
        } = body;
        console.log(productInfo);

        const units = ["قطعة", "طقم", "كيلو"];
        const categories = [
            " منتج تام مركب",
            "منتج تام فردي",
            "خامات",
            "قطع غيار",
            "معدات",
        ];
        // const setUnits = await prismaDb.units.createMany({
        //     data: units.map((unit) => {
        //         return {
        //             name: unit,
        //         };
        //     }),
        // });
        // const setcategories = await prismaDb.catgories.createMany({
        //     data: categories.map((unit) => {
        //         return {
        //             name: unit,
        //         };
        //     }),
        // });

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

            const products = await prismaDb.product.findMany({});

            // create inventory items based on the current products
            // products.forEach(async (product) => {
            //     const inventoryItem = await prismaDb.inventory.create({
            //         data: {
            //             product: {
            //                 connect: {
            //                     id: product.id,
            //                 },
            //             },
            //             quantity: 0,
            //         },
            //     });
            // });
            // const inventoryItems = await prismaDb.inventory.findMany({});

            // console.log(inventoryItems);

            return NextResponse.json(updatedProduct);
        } else {
            const newProduct = await prismaDb.product.create({
                data: {
                    name: productInfo.productName,
                    price: productInfo.price,
                    Parts: {
                        createMany: {
                            data: productInfo.parts.map((part) => {
                                return {
                                    name: part.name,
                                    quantity: part.quantity,
                                };
                            }),
                        },
                    },
                    Inventory: {
                        create: {
                            quantity: 0,
                        },
                    },
                },
                include: {
                    Parts: true,
                },
            });
            console.log(newProduct);

            return NextResponse.json(newProduct);
        }
    } catch (error) {
        console.log(`[add Product-Post]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}

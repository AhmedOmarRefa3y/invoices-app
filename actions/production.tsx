"use server";

import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ProductionT {
    prdouctID: string;
    quantity: number;
}
export const CreateProduction = async (Data: ProductionT) => {
    try {
        const { prdouctID, quantity } = Data;
        if (!prdouctID) {
            throw new Error("PrdocutId is required");
        }
        if (!quantity) {
            throw new Error("quantity is required");
        }
        const productionEvent = await prismaDb.productionEvent.create({
            data: {
                lineItems: {
                    create: {
                        productId: prdouctID,
                        quantity: quantity,
                    },
                },
            },
            include: {
                lineItems: true,
            },
        });

        const item = await prismaDb.inventoryRecord.findFirst({
            where: {
                productId: prdouctID,
                year: new Date().getFullYear(),
            },
        });
        await prismaDb.inventoryRecord.update({
            where: {
                id: item?.id,
            },
            data: {
                ReceivedQuantity: {
                    increment: quantity,
                },
            },
        });
        revalidatePath("/inventory");
        return {
            status: "ok",
            message: "productionEvent Created Sucessfully",
            data: productionEvent,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went while Updating invoice ",
            data: null,
        };
    }
};

"use server";

import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface productionItem {
    id: string;
    quantity: number;
    type: "in" | "out";
}

export const CreateProduction = async (items: productionItem[]) => {
    try {
        if (!items || items.length < 1) {
            throw new Error("items is required");
        }

        const productionEvent = await prismaDb.productionEvent.create({
            data: {
                lineItems: {
                    create: items.map((item) => {
                        return {
                            quantity: item.quantity,
                            productId: item.id,
                            isProduction: item.type === "in",
                            isReduction: item.type === "out",
                        };
                    }),
                },
            },
            include: {
                lineItems: true,
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

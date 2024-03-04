"use server";

import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { revalidateApp } from "./customer";

interface CreateProductionT {
    productionItems: { id: string; quantity: number; type: "in" | "out" }[];
    productionPlanI: string;
}
export const CreateProduction = async (data: CreateProductionT) => {
    try {
        if (!data.productionItems || data.productionItems.length < 1) {
            throw new Error("items is required");
        }

        const productionEvent = await prismaDb.productionEvent.create({
            data: {
                productionPlanId: data.productionPlanI,
                lineItems: {
                    create: data.productionItems.map((item) => {
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

        revalidateApp();
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

interface ProductionPLanItem {
    id: string;
    quantity: number;
}
interface CreateProductionPLanT {
    ProductionPLanItems: {
        id: string;
        quantity: number;
    }[];
    ProductionPLanProducts: {
        id: string;
        quantity: number;
    }[];
}
export const CreateProductionPLan = async (Data: CreateProductionPLanT) => {
    try {
        if (!Data || Data.ProductionPLanItems.length < 1) {
            throw new Error("items is required");
        }

        const productionPLan = await prismaDb.productionPlan.create({
            data: {
                lineItems: {
                    create: Data.ProductionPLanItems.map((item) => {
                        return {
                            quantity: item.quantity,
                            productId: item.id,
                        };
                    }),
                },
                Products: {
                    create: Data.ProductionPLanProducts.map((item) => {
                        return {
                            productId: item.id,
                            quantity: item.quantity,
                        };
                    }),
                },
            },
            include: {
                lineItems: true,
            },
        });

        revalidateApp();
        return {
            status: "ok",
            message: "productionPLan Created Sucessfully",
            data: productionPLan,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went while creating Production PLan ",
            data: null,
        };
    }
};

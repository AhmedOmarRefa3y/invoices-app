"use server";

import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface NewProductDataT {
    name: string;
    price: number;
    parts: {
        name: string;
        quantity: number;
    }[];
    unitID: string;
    categoryID: string;
    PrdocutId?: string;
    initialQuantity: number;
    year: number;
}

export async function CreateProduct(Data: NewProductDataT) {
    try {
        const {
            name,
            price,
            parts,
            unitID,
            categoryID,
            initialQuantity,
            year,
        } = Data;

        if (!name) {
            throw new Error("name is required");
        }
        if (!price) {
            throw new Error("price is required");
        }
        if (!unitID) {
            throw new Error("unitID is required");
        }
        if (!categoryID) {
            throw new Error("categoryID is required");
        }

        const newProduct = await prismaDb.product.create({
            data: {
                name,
                price,
                Parts: parts
                    ? {
                          createMany: {
                              data: parts.map((part) => {
                                  return {
                                      name: part.name,
                                      quantity: part.quantity,
                                  };
                              }),
                          },
                      }
                    : undefined,

                unit: {
                    connect: {
                        id: unitID,
                    },
                },
                catgory: {
                    connect: {
                        id: categoryID,
                    },
                },
            },
            include: {
                Parts: true,
            },
        });
        const CreateInventoryRecord = await prismaDb.inventoryRecord.create({
            data: {
                productId: newProduct.id,
                openingQuantity: initialQuantity,
                year: year,
            },
        });
        revalidatePath("/invoices/sales");
        return {
            status: "ok",
            message: "Product Created Sucessfully",
            data: {
                prodId: newProduct.id,
                inventory: CreateInventoryRecord.id,
            },
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went while deleting invoice ",
            data: null,
        };
    }
}

export async function UpdateProduct(Data: NewProductDataT) {
    try {
        const {
            name,
            price,
            parts,
            unitID,
            categoryID,
            PrdocutId,
            initialQuantity,
            year,
        } = Data;

        if (!PrdocutId) {
            throw new Error("PrdocutId is required");
        }
        if (!name) {
            throw new Error("name is required");
        }
        if (!price) {
            throw new Error("price is required");
        }
        if (!unitID) {
            throw new Error("unitID is required");
        }
        if (!categoryID) {
            throw new Error("categoryID is required");
        }

        await prismaDb.part.deleteMany({
            where: {
                productId: PrdocutId,
            },
        });
        const UpdateProduct = await prismaDb.product.update({
            where: {
                id: PrdocutId,
            },
            data: {
                name,
                price,
                Parts: parts
                    ? {
                          createMany: {
                              data: parts.map((part) => {
                                  return {
                                      name: part.name,
                                      quantity: part.quantity,
                                  };
                              }),
                          },
                      }
                    : undefined,

                unit: {
                    connect: {
                        id: unitID,
                    },
                },
                catgory: {
                    connect: {
                        id: categoryID,
                    },
                },
            },
            include: {
                Parts: true,
            },
        });

        const inventory = await prismaDb.inventoryRecord.findFirst({
            where: {
                productId: PrdocutId,
                year: year,
            },
        });
        await prismaDb.inventoryRecord.update({
            where: {
                id: inventory?.id,
            },
            data: {
                openingQuantity: initialQuantity,
                year,
            },
        });
        revalidatePath("/invoices/sales");
        return {
            status: "ok",
            message: "Product Updated Sucessfully",
            data: UpdateProduct,
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
}

export async function DELETE(id: string) {
    try {
        if (!id) {
            throw new Error("Id is required");
        }
        await prismaDb.product.delete({
            where: {
                id,
            },
        });
        revalidatePath("/invoices/sales");
        return {
            status: "ok",
            message: "Product deleted Sucessfully",
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went wrong while deleting Product ",
            data: null,
        };
    }
}

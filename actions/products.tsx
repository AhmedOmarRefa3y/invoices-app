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
}

export async function CreateProduct(Data: NewProductDataT) {
    try {
        const { name, price, parts, unitID, categoryID } = Data;

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
        revalidatePath("/invoices/sales");
        return {
            status: "ok",
            message: "Product Created Sucessfully",
            data: newProduct,
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
        const { name, price, parts, unitID, categoryID, PrdocutId } = Data;

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

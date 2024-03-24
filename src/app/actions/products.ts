"use server";

import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { revalidateApp } from "./customer";
import { NewProductDataT } from "@/types";

export async function CreateProduct(Data: NewProductDataT) {
    try {
        const { name, price, unitID, categoryID, parts, orgID } = Data;

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
        if (!orgID) {
            throw new Error("orgID is required");
        }
        const newProduct = await prismaDb.product.create({
            data: {
                name,
                price,
                Part: parts
                    ? {
                          createMany: {
                              data: parts.map((part) => {
                                  return {
                                      name: part.name,
                                      partProductId: part.productid,
                                      quantity: part.quantity,
                                      organizationId: orgID,
                                  };
                              }),
                          },
                      }
                    : undefined,
                isAcomopsition: parts && parts?.length > 0 ? true : false,
                unit: {
                    connect: {
                        id: unitID,
                    },
                },
                category: {
                    connect: {
                        id: categoryID,
                    },
                },
                organization: {
                    connect: {
                        id: orgID,
                    },
                },
            },
        });

        revalidateApp();
        return {
            status: "ok",
            message: "Product Created Sucessfully",
            data: {
                prodId: newProduct.id,
            },
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "something went while cerating Product ",
            data: null,
        };
    }
}

export async function UpdateProduct(Data: NewProductDataT) {
    try {
        const { PrdocutId, name, price, unitID, categoryID, parts, orgID } =
            Data;

        if (!orgID) {
            throw new Error("PrdocutId is required");
        }
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
                Part: parts
                    ? {
                          createMany: {
                              data: parts.map((part) => {
                                  return {
                                      name: part.name,
                                      partProductId: part.productid,
                                      quantity: part.quantity,
                                      organizationId: orgID,
                                  };
                              }),
                          },
                      }
                    : undefined,
                isAcomopsition: parts && parts?.length > 0 ? true : false,
                unit: {
                    connect: {
                        id: unitID,
                    },
                },
                category: {
                    connect: {
                        id: categoryID,
                    },
                },
            },
        });

        await prismaDb.part.updateMany({
            where: {
                partProductId: PrdocutId,
            },
            data: {
                name: name,
            },
        });
        revalidateApp();
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

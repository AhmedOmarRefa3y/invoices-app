"use server";

import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { revalidateApp } from "./customer";

export interface NewProductDataT {
    PrdocutId?: string | undefined;
    name: string | undefined;
    price: number | undefined;
    categoryID?: string | undefined;
    unitID: string | undefined;
    parts?: { productid: string; quantity: number; name: string }[] | undefined;
}

export async function CreateProduct(Data: NewProductDataT) {
    try {
        const { name, price, unitID, categoryID, parts } = Data;

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

        // const newpart = await prismaDb.productPart.createMany({
        //     data: {},
        // });
        const newProduct = await prismaDb.product.create({
            data: {
                name,
                price,
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

        if (parts) {
            const CreateParts = await prismaDb.part.createMany({
                data: parts,

                // productId: part.productid,
                // name: part.name,
                // quantity: part.quantity,
            });
        }
        const CreateParts = async () => {
            if (parts) {
                const createNewparts = await prismaDb.part.createMany({
                    data: parts.map((part) => {
                        return {
                            name: part.name,
                        };
                    }),
                });
                return CreateRecord;
            }
        };
        const CreateInventoryRecord = async () => {
            if (!parts) {
                const CreateRecord = await prismaDb.inventoryRecord.create({
                    data: {
                        productId: newProduct.id,
                    },
                });
                return CreateRecord;
            }
        };

        const InventoryRecord = await CreateInventoryRecord();

        revalidateApp();
        return {
            status: "ok",
            message: "Product Created Sucessfully",
            data: {
                prodId: newProduct.id,
                inventory: InventoryRecord?.id,
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

// export async function CreateProductPackage(Data: NewProductDataT) {
//     try {
//         const { name, price, unitID, parts, categoryID } = Data;

//         if (!name) {
//             throw new Error("name is required");
//         }
//         if (!price) {
//             throw new Error("price is required");
//         }
//         if (!unitID) {
//             throw new Error("unitID is required");
//         }
//         if (!categoryID) {
//             throw new Error("categoryID is required");
//         }
//         if (!parts || parts.length < 1) {
//             throw new Error("parts is required");
//         }

//         const newProductPackage = await prismaDb.productPackage.create({
//             data: {
//                 name,
//                 price,
//                 unitId: unitID,
//                 Parts: {
//                     createMany: {
//                         data: parts.map((part) => {
//                             return {
//                                 productId: part.productid,
//                                 name: part.name,
//                                 quantity: part.quantity,
//                             };
//                         }),
//                     },
//                 },
//             },
//             include: {
//                 Parts: true,
//             },
//         });

//         revalidateApp();
//         console.log(newProductPackage);
//         return {
//             status: "ok",
//             message: "ProductPackage Created Sucessfully",
//             data: {
//                 prodId: newProductPackage.id,
//             },
//         };
//     } catch (error) {
//         return {
//             status: "error",
//             message:
//                 error instanceof Error
//                     ? error.message
//                     : "something went while Creating ProductPackage ",
//             data: null,
//         };
//     }
// }
export async function UpdateProduct(Data: NewProductDataT) {
    try {
        const { PrdocutId, name, price, unitID, categoryID } = Data;

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
// export async function UpdateProductPackage(Data: NewProductDataT) {
//     try {
//         const { PrdocutId, name, price, parts, unitID, categoryID } = Data;

//         if (!PrdocutId) {
//             throw new Error("PrdocutId is required");
//         }
//         if (!name) {
//             throw new Error("name is required");
//         }
//         if (!price) {
//             throw new Error("price is required");
//         }
//         if (!unitID) {
//             throw new Error("unitID is required");
//         }
//         if (!categoryID) {
//             throw new Error("categoryID is required");
//         }

//         await prismaDb.part.deleteMany({
//             where: {
//                 productPackageId: PrdocutId,
//             },
//         });
//         const UpdateProductPackage = await prismaDb.productPackage.update({
//             where: {
//                 id: PrdocutId,
//             },
//             data: {
//                 name,
//                 price,
//                 Parts: parts
//                     ? {
//                           createMany: {
//                               data: parts.map((part) => {
//                                   return {
//                                       productId: part.productid,
//                                       name: part.name,
//                                       quantity: part.quantity,
//                                   };
//                               }),
//                           },
//                       }
//                     : undefined,

//                 unit: {
//                     connect: {
//                         id: unitID,
//                     },
//                 },
//                 // category: {
//                 //     connect: {
//                 //         id: categoryID,
//                 //     },
//                 // },
//             },
//             include: {
//                 Parts: true,
//             },
//         });
//         revalidatePath("/invoices/sales");
//         return {
//             status: "ok",
//             message: "ProductPackage Updated Sucessfully",
//             data: UpdateProductPackage,
//         };
//     } catch (error) {
//         return {
//             status: "error",
//             message:
//                 error instanceof Error
//                     ? error.message
//                     : "something went while Updating ProductPackage ",
//             data: null,
//         };
//     }
// }

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

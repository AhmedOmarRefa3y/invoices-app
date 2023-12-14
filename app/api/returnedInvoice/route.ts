import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const returnedInvoiceDATA: {
            InvoiceInfo: {
                date: Date;
                Items: {
                    productId: string;
                    quantity: number;
                    price: number;
                }[];
                customerId: string;
                amount: number;
            };
            InvoiceId: string;
        } = body;
        const NEWreturnedInvoice = await prismaDb.returnedInvoice.create({
            data: {
                customer: {
                    connect: {
                        id: returnedInvoiceDATA.InvoiceInfo.customerId,
                    },
                },
                date: returnedInvoiceDATA.InvoiceInfo.date,
                lineItems: {
                    createMany: {
                        data: returnedInvoiceDATA.InvoiceInfo.Items.map(
                            (item) => {
                                return {
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    amount: item.quantity * item.price,
                                    price: item.price,
                                };
                            }
                        ),
                    },
                },
                amount: returnedInvoiceDATA.InvoiceInfo.amount,
            },
        });

        for (const item of returnedInvoiceDATA.InvoiceInfo.Items) {
            const updateInventory = await prismaDb.inventory.update({
                where: {
                    productId: item.productId,
                },
                data: {
                    quantity: {
                        increment: item.quantity,
                    },
                },
            });
            console.log("updatedInventory", updateInventory);
        }
        console.log(NEWreturnedInvoice);

        return NextResponse.json(NEWreturnedInvoice);
    } catch (error) {
        console.log(`[NEWreturnedInvoice-Post]`, error);
        return new NextResponse("NEWreturnedInvoice error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const returnedInvoiceDATA: {
            id: string;
        } = body;
        console.log(returnedInvoiceDATA);

        const DeleteInvoice = await prismaDb.returnedInvoice.delete({
            where: {
                id: returnedInvoiceDATA.id,
            },
            include: {
                lineItems: true,
            },
        });

        console.log(DeleteInvoice);

        if (DeleteInvoice) {
            console.log("yes");
            for (const item of DeleteInvoice.lineItems) {
                console.log(item);
                const UpdateInventory = await prismaDb.inventory.update({
                    where: {
                        productId: item.productId,
                    },
                    data: {
                        quantity: {
                            increment: item.quantity,
                        },
                    },
                });
                console.log("UpdatedInventory", UpdateInventory);
                return NextResponse.json(UpdateInventory);
            }
        } else {
            console.log("Returned invoice or line items not found.");
            return new NextResponse("NEWreturnedInvoice error", {
                status: 500,
            });
        }
        return NextResponse.json(DeleteInvoice);
    } catch (error) {
        return new NextResponse("NEWreturnedInvoice error", { status: 500 });
    }
}

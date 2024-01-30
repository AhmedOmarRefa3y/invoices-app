"use server";

import prismaDb from "@/lib/prisma";

export async function DbEdit() {
    // const orderItems = await prismaDb.orderItem.deleteMany();
    // const invlineItems = await prismaDb.lineItem.findMany({
    //     where: {
    //         invoiceId: {
    //             not: null,
    //         },
    //         productId: {
    //             not: undefined,
    //         },
    //     },
    // });
    // const retInvlineItem = await prismaDb.lineItem.findMany({
    //     where: {
    //         returnedInvoiceId: {
    //             not: null,
    //         },
    //     },
    // });

    // const orderItems = await prismaDb.orderItem.createMany({
    //     data: invlineItems.map((item) => {
    //         return {
    //             amount: item.amount as number,
    //             price: item.price as number,
    //             quantity: item.quantity,
    //             invoiceId: item.invoiceId,
    //             OrderNumber: item.ItemNumber as number,
    //             productId: item.productId,
    //         };
    //     }),
    // });

    // console.log(invlineItems.count);
    // console.log(orderItems.count);
    // console.log(invlineItems.length);
    // console.log(retInvlineItem.length);

    // const itemsWithoutRelations = await prismaDb.lineItem.findMany({
    //     where: {
    //         returnedInvoiceId: null,
    //         productionEventId: null,
    //         invoiceId: null,
    //     },
    // });

    // console.log(itemsWithoutRelations);
    console.log("edit db run");
}

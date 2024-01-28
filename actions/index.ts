"use server";

import prismaDb from "@/lib/prisma";
import { OrderItem } from "@prisma/client";

export async function DbEdit() {
    const itemProd = await prismaDb.productionEvent.findMany();

    console.log(itemProd.length);

    const prodLineitems = await prismaDb.lineItem.createMany({
        data: itemProd.map((item) => {
            return {
                productId: item.productId as string,
                quantity: item.quantity as number,
                productionEventId: item.id,
            };
        }),
    });
    console.log(prodLineitems.count);

    console.log("edit db run");
}

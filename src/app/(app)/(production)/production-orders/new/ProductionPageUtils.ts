"use client";

import { CreateProduction } from "@/actions/production";
import useProdcutionStore, { ProductionProduct } from "@/lib/productionStore";
import toast from "react-hot-toast";

interface productionItem {
    id: string;
    quantity: number;
    type: "in" | "out";
}

interface SaveProductionT {
    MainProducts: ProductionProduct[];
    RawMaterials: ProductionProduct[];
    productionPlanID: string;
}
export const SaveProduction = async ({
    MainProducts,
    RawMaterials,
    productionPlanID,
}: SaveProductionT) => {
    const Items: productionItem[] = [];

    MainProducts.map((item) => {
        if (item.Quantity > 0) {
            Items.push({
                id: item.id,
                quantity: item.Quantity,
                type: "in",
            });
        }
    });
    RawMaterials.map((item) => {
        if (item.Quantity > 0) {
            Items.push({
                id: item.id,
                quantity: item.Quantity,
                type: "out",
            });
        }
    });

    console.log(Items);
    // return;
    const sendTODb = async () => {
        const { status, data, message } = await CreateProduction({
            productionItems: Items,
            productionPlanI: productionPlanID,
        });
        if (status === "ok") {
            toast.success(message);
        } else {
            toast.error(message);
        }
        // console.log(data);
        return {
            status,
            data,
            message,
        };
    };
    return sendTODb();
};

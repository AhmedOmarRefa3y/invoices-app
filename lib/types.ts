import { Part } from "@prisma/client";

export interface ProductionProduct {
    productId: string;
    name: string;
    quantity?: number;
    parts?: Part[];
}

import { Prisma } from "@prisma/client";

export type ProductT = Prisma.ProductGetPayload<{}>;
export type PartT = Prisma.PartGetPayload<{}>;
export type CategoriesT = Prisma.CatgoriesGetPayload<{}>;
export type UnitT = Prisma.UnitsGetPayload<{}>;
export type CustomerT = Prisma.CustomerGetPayload<{}>;

export interface NewProductDataT {
    isAcomopsition: boolean;
    PrdocutId?: string;
    name: string;
    price: number;
    categoryID: string;
    unitID: string;
    orgID?: string;
    parts?: { productid: string; quantity: number; name: string }[];
}

import { Prisma } from "@prisma/client";

export type ProductT = Prisma.ProductGetPayload<{
    include: {
        Part: true;
        LineItem: true;
        Orders: true;
        ProductionPLanProduct: true;
        _count: true;
        category: true;
        organization: true;
        unit: true;
    };
}>;
export type PartT = Prisma.PartGetPayload<{
    include: {
        organization: true;
        ProductPackage: true;
        product: true;
    };
}>;
export type CategoriesT = Prisma.CatgoriesGetPayload<{
    include: {
        _count: true;
        organization: true;
        products: true;
    };
}>;
export type UnitT = Prisma.UnitsGetPayload<{
    include: {
        _count: true;
        organization: true;
        products: true;
    };
}>;
export type CustomerT = Prisma.CustomerGetPayload<{
    include: {
        Payment: true;
        Orders: true;
        _count: true;
        organization: true;
    };
}>;

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

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

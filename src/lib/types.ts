import { Prisma } from "@prisma/client";

export type ProductT = Prisma.ProductGetPayload<object>;
export type PartT = Prisma.PartGetPayload<object>;
export type CategoriesT = Prisma.CatgoriesGetPayload<object>;
export type UnitT = Prisma.UnitsGetPayload<object>;
export type CustomerT = Prisma.CustomerGetPayload<object>;

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

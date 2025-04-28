"use server";

import prismaDb from "../prisma";

export const GetProduct = async (id: string) => {
  const product = await prismaDb.product.findUnique({
    where: {
      id,
    },
    include: {
      Part: {
        include: {
          product: true,
        },
      },
    },
  });
  return product;
};

"use server";

import prismaDb from "@/lib/prisma";
import { revalidateApp } from "./customer";

interface CreateProductionT {
  productionItems: { id: string; quantity: number; type: "in" | "out" }[];
  productionPlanI: string;
  orgid: string;
}
export const CreateProduction = async (data: CreateProductionT) => {
  try {
    if (!data.orgid) {
      throw new Error("orgid are required");
    }
    if (!data.productionItems || data.productionItems.length < 1) {
      throw new Error("items are required");
    }
    if (!data.productionPlanI) {
      throw new Error("production Plan ID are required");
    }

    const productionEvent = await prismaDb.productionEvent.create({
      data: {
        productionPlanId: data.productionPlanI,
        lineItems: {
          create: data.productionItems.map((item) => {
            return {
              quantity: item.quantity,
              productId: item.id,
              isProduction: item.type === "in",
              isReduction: item.type === "out",
              organizationId: data.orgid,
            };
          }),
        },
        organizationId: data.orgid,
      },
      include: {
        lineItems: true,
      },
    });

    revalidateApp();
    return {
      status: "ok",
      message: "productionEvent Created Sucessfully",
      data: productionEvent,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "something went while Updating invoice ",
      data: null,
    };
  }
};
export const DeleteProductionORder = async (id: string) => {
  try {
    if (!id) {
      throw new Error("id is required");
    }

    const DeleteProductionORder = await prismaDb.productionEvent.delete({
      where: {
        id,
      },
    });

    revalidateApp();
    return {
      status: "ok",
      message: "ProductionORder deleted Sucessfully",
      data: DeleteProductionORder,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "something went while deleting ProductionORder ",
      data: null,
    };
  }
};
export const DeleteProductionPlan = async (id: string) => {
  try {
    if (!id) {
      throw new Error("id is required");
    }

    // console.log(id);
    const DeleteProductionPlan = await prismaDb.productionPlan.delete({
      where: {
        id,
      },
    });

    // console.log(DeleteProductionPlan);

    revalidateApp();
    return {
      status: "ok",
      message: "Production Plan deleted Sucessfully",
      data: DeleteProductionPlan,
    };
  } catch (error) {
    // console.log(error);

    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "something went while deleting DeleteProductionPlan ",
      data: null,
    };
  }
};
interface CreateProductionPLanT {
  ProductionPLanItems: {
    id: string;
    quantity: number;
  }[];
  ProductionPLanProducts: {
    id: string;
    quantity: number;
  }[];
  orgid: string;
}

export const CreateProductionPLan = async (Data: CreateProductionPLanT) => {
  try {
    if (!Data || Data.ProductionPLanItems.length < 1) {
      throw new Error("items are required");
    }

    const productionPLan = await prismaDb.productionPlan.create({
      data: {
        lineItems: {
          create: Data.ProductionPLanItems.map((item) => {
            return {
              quantity: item.quantity,
              organization: {
                connect: {
                  id: Data.orgid,
                },
              },
              product: {
                connect: {
                  id: item.id,
                },
              },
            };
          }),
        },
        Products: {
          create: Data.ProductionPLanProducts.map((item) => {
            return {
              Product: {
                connect: {
                  id: item.id,
                },
              },
              quantity: item.quantity,
              organization: {
                connect: {
                  id: Data.orgid,
                },
              },
            };
          }),
        },
        organization: {
          connect: {
            id: Data.orgid,
          },
        },
      },
    });

    revalidateApp();
    return {
      status: "ok",
      message: "productionPLan Created Sucessfully",
      data: productionPLan,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "something went while creating Production PLan ",
      data: null,
    };
  }
};

interface InitailQuantitesListT {
  products: {
    id: string;
    quantity: number;
  }[];
  orgid: string;
}
export const CreateInitailQuantitesList = async (data: InitailQuantitesListT) => {
  try {
    if (!data.orgid) {
      throw new Error("orgid are required");
    }
    if (!data.products || data.products.length < 1) {
      throw new Error("items are required");
    }

    const InitailQuantitesList = await prismaDb.initialquantities.create({
      data: {
        products: {
          create: data.products.map((item) => {
            return {
              quantity: item.quantity,
              product: {
                connect: {
                  id: item.id,
                },
              },
              organization: {
                connect: {
                  id: data.orgid,
                },
              },
            };
          }),
        },
        year: 2024,
        organization: {
          connect: {
            id: data.orgid,
          },
        },
      },
      include: {
        products: true,
      },
    });

    revalidateApp();
    return {
      status: "ok",
      message: "Initail Quantites List Created Sucessfully",
      data: InitailQuantitesList,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "something went while creating Initail Quantites List ",
      data: null,
    };
  }
};

interface EditInitailQuantitesListT {
  products: {
    id: string;
    quantity: number;
  }[];
  id: string;
  orgid: string;
}
export const UpdateInitailQuantitesList = async (data: EditInitailQuantitesListT) => {
  try {
    if (!data.orgid) {
      throw new Error("orgid are required");
    }
    if (!data.products || data.products.length < 1) {
      throw new Error("items are required");
    }
    if (!data.id) {
      throw new Error("ID is required");
    }

    await prismaDb.lineItem.deleteMany({
      where: {
        initialquantitiesId: data.id,
      },
    });

    const InitailQuantitesList = await prismaDb.initialquantities.update({
      where: {
        id: data.id,
      },
      data: {
        products: {
          create: data.products.map((item) => {
            return {
              quantity: item.quantity,
              product: {
                connect: {
                  id: item.id,
                },
              },
              organization: {
                connect: {
                  id: data.orgid,
                },
              },
            };
          }),
        },
        year: 2024,
      },
      include: {
        products: true,
      },
    });

    revalidateApp();
    return {
      status: "ok",
      message: "Initail Quantites List Updated Sucessfully",
      data: InitailQuantitesList,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "something went while Updating Initail Quantites List ",
      data: null,
    };
  }
};

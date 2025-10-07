"use server";

import { revalidateApp } from "@/actions";
import prismaDb from "@/lib/prisma";

export async function CreateUnit(Data: { UnitName: string; orgID: string }) {
  try {
    if (!Data.orgID) {
      throw new Error("orgID is required");
    }
    if (!Data.UnitName) {
      throw new Error("Unit Name is required");
    }
    const NewUnit = await prismaDb.units.create({
      data: {
        name: Data.UnitName,
        organizationId: Data.orgID,
      },
    });
    if (!NewUnit) {
      throw new Error("Failed to create Unit");
    }
    revalidateApp();
    return {
      status: "ok",
      message: "Unit created successfully",
      Data: NewUnit,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while creating new Unit",
    };
  }
}
export async function UpdateUnit(Data: { UnitId: string; UnitName: string; orgID: string }) {
  try {
    if (!Data.orgID) {
      throw new Error("orgID is required");
    }
    if (!Data.UnitId) {
      throw new Error("Unit ID is required");
    }
    if (!Data.UnitName) {
      throw new Error("Unit Name is required");
    }

    const updatedUnit = await prismaDb.units.update({
      where: {
        id: Data.UnitId,
        organizationId: Data.orgID,
      },
      data: {
        name: Data.UnitName,
      },
    });

    if (!updatedUnit) {
      throw new Error("Failed to update Unit");
    }

    revalidateApp();
    return {
      status: "ok",
      message: "Unit updated successfully",
      Data: updatedUnit,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Something went wrong while updating Unit",
      Data: null,
    };
  }
}

export async function DeleteUnit(Data: { UnitId: string; orgID: string }) {
  try {
    if (!Data.orgID) {
      throw new Error("orgID is required");
    }
    if (!Data.UnitId) {
      throw new Error("Unit ID is required");
    }

    // Check if the unit is being used by any products
    const unitInUse = await prismaDb.product.findFirst({
      where: {
        unitId: Data.UnitId,
        organizationId: Data.orgID,
      },
    });

    if (unitInUse) {
      throw new Error("Cannot delete unit because it is being used by one or more products");
    }

    const deletedUnit = await prismaDb.units.delete({
      where: {
        id: Data.UnitId,
        organizationId: Data.orgID,
      },
    });

    if (!deletedUnit) {
      throw new Error("Failed to delete Unit");
    }

    revalidateApp();
    return {
      status: "ok",
      message: "Unit deleted successfully",
      Data: deletedUnit,
    };
  } catch (error) {
    // Handle Prisma constraint errors specifically
    if (error instanceof Error) {
      if (error.message.includes("Constraint") || error.message.includes("foreign key")) {
        return {
          status: "error",
          message: "Cannot delete unit because it is being used by one or more products",
          Data: null,
        };
      }

      return {
        status: "error",
        message: error.message,
        Data: null,
      };
    }

    return {
      status: "error",
      message: "Something went wrong while deleting Unit",
      Data: null,
    };
  }
}

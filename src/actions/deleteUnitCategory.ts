"use server";

import prismaDb from "@/lib/prisma";
import { revalidateApp } from "./customer";

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

export async function DeleteCategory(Data: { CategoryId: string; orgID: string }) {
  try {
    if (!Data.orgID) {
      throw new Error("orgID is required");
    }
    if (!Data.CategoryId) {
      throw new Error("Category ID is required");
    }
    
    // Check if the category is being used by any products
    const categoryInUse = await prismaDb.product.findFirst({
      where: {
        catgoryId: Data.CategoryId,
        organizationId: Data.orgID,
      },
    });
    
    if (categoryInUse) {
      throw new Error("Cannot delete category because it is being used by one or more products");
    }
    
    const deletedCategory = await prismaDb.catgories.delete({
      where: {
        id: Data.CategoryId,
        organizationId: Data.orgID,
      },
    });
    
    if (!deletedCategory) {
      throw new Error("Failed to delete Category");
    }
    
    revalidateApp();
    return {
      status: "ok",
      message: "Category deleted successfully",
      Data: deletedCategory,
    };
  } catch (error) {
    // Handle Prisma constraint errors specifically
    if (error instanceof Error) {
      if (error.message.includes("Constraint") || error.message.includes("foreign key")) {
        return {
          status: "error",
          message: "Cannot delete category because it is being used by one or more products",
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
      message: "Something went wrong while deleting Category",
      Data: null,
    };
  }
}
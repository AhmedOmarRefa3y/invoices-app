"use server";

import prismaDb from "@/lib/prisma";
import { revalidateApp } from "./customer";

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
      message:
        error instanceof Error ? error.message : "Something went wrong while updating Unit",
      Data: null,
    };
  }
}

export async function UpdateCategory(Data: { CategoryId: string; CategoryName: string; orgID: string }) {
  try {
    if (!Data.orgID) {
      throw new Error("orgID is required");
    }
    if (!Data.CategoryId) {
      throw new Error("Category ID is required");
    }
    if (!Data.CategoryName) {
      throw new Error("Category Name is required");
    }
    
    const updatedCategory = await prismaDb.catgories.update({
      where: {
        id: Data.CategoryId,
        organizationId: Data.orgID,
      },
      data: {
        name: Data.CategoryName,
      },
    });
    
    if (!updatedCategory) {
      throw new Error("Failed to update Category");
    }
    
    revalidateApp();
    return {
      status: "ok",
      message: "Category updated successfully",
      Data: updatedCategory,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while updating Category",
      Data: null,
    };
  }
}
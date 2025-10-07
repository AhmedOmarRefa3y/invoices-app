import { revalidateApp } from "@/actions/customers";
import prismaDb from "@/lib/prisma";

export async function CreateInventory(Data: { InventoryName: string; orgID: string }) {
  try {
    if (!Data.orgID) {
      throw new Error("orgID is required");
    }
    if (!Data.InventoryName) {
      throw new Error("Inventory Name is required");
    }
    const NewInventory = await prismaDb.catgories.create({
      data: {
        name: Data.InventoryName,
        organizationId: Data.orgID,
      },
    });
    if (!NewInventory) {
      throw new Error("Failed to create New Inventory");
    }
    revalidateApp();
    return {
      status: "ok",
      message: "New Inventory created successfully",
      Data: NewInventory,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating New Inventory",
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

export async function UpdateCategory(Data: {
  CategoryId: string;
  CategoryName: string;
  orgID: string;
}) {
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

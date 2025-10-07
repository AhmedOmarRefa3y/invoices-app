"use server";
import { revalidateApp } from "@/actions";
import prismaDb from "@/lib/prisma";
import { Customer } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function CreateCustomer(Data: {
  customerName: string;
  location?: string;
  phoneNumber?: string;
  OpenCredit?: number;
  orgid: string;
}) {
  try {
    if (!Data.customerName) throw new Error("Customer name is required");
    if (!Data.orgid) throw new Error("Organization ID is required");

    // 1️⃣ نجيب حساب "Accounts Receivable"
    const accountsReceivable = await prismaDb.ledgerAccount.findFirst({
      where: {
        name: "Accounts Receivable",
        organizationId: Data.orgid,
      },
    });

    if (!accountsReceivable) {
      throw new Error(
        "Accounts Receivable account not found. Please seed the main accounts first."
      );
    }

    const customerAccount = await prismaDb.ledgerAccount.create({
      data: {
        name: `Customer: ${Data.customerName}`,
        code: `${accountsReceivable.code}-${Date.now()}`,
        parentId: accountsReceivable.id,
        type: accountsReceivable.type,
        normalSide: accountsReceivable.normalSide,
        organizationId: Data.orgid,
        isLeaf: true,
      },
    });

    const NewCustomer = await prismaDb.customer.create({
      data: {
        name: Data.customerName,
        phoneNumber: Data.phoneNumber,
        location: Data.location,
        CustomerCredit: Data.OpenCredit,
        organizationId: Data.orgid,
        LedgerAccountId: customerAccount.id,
      },
    });

    if (!NewCustomer) {
      throw new Error("Failed to create customer");
    }

    revalidateApp();

    return {
      status: "ok",
      message: "Customer and account created successfully",
      Data: NewCustomer,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while creating customer",
    };
  }
}

export async function UpdateCustomer(Data: {
  id: string | undefined;
  customerName: string;
  location?: string | undefined;
  phoneNumber?: string | undefined;
  OpenCredit?: number | undefined;
}) {
  try {
    if (!Data.id) {
      throw new Error("Customer ID is required");
    }
    if (!Data.customerName) {
      throw new Error("Customer ID is required");
    }
    const UpdateCustomer = await prismaDb.customer.update({
      where: {
        id: Data.id,
      },
      data: {
        CustomerCredit: Data.OpenCredit || 0,
        name: Data.customerName,
        location: Data.location,
        phoneNumber: Data.phoneNumber?.toString(),
      },
    });
    revalidateApp();
    if (UpdateCustomer) {
      return {
        status: "ok",
        message: "Customer Updated successfully",
        Data: UpdateCustomer,
      };
    } else {
      throw new Error("Something went wrong while Updating customer");
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while Updating customer",
    };
  }
}

export async function DeleteCustomer(id: string) {
  try {
    if (!id) {
      throw new Error("Customer ID is required");
    }
    const DeleteCustomer = await prismaDb.customer.delete({
      where: {
        id,
      },
    });
    revalidateApp();
    return {
      status: "ok",
      message: "Customer deleted successfully",
      data: DeleteCustomer,
    };
  } catch (error) {
    // Handle Prisma constraint errors specifically
    if (error instanceof Error) {
      if (error.message.includes("Constraint") || error.message.includes("foreign key")) {
        return {
          status: "error",
          message: "Cannot delete customer because they are associated with invoices or payments",
        };
      }

      return {
        status: "error",
        message: error.message,
      };
    }

    return {
      status: "error",
      message: "Something went wrong while deleting customer",
    };
  }
}

type CustomerResponse = {
  status: "ok" | "error";
  message: string;
  data?: Customer[];
  error?: string;
};

export async function getCustomers(orgId: string): Promise<CustomerResponse> {
  if (!orgId) {
    return {
      status: "error",
      message: "Organization ID is required",
      error: "Missing organization ID",
    };
  }

  try {
    const customers = await prismaDb.customer.findMany({
      where: { organizationId: orgId },
    });

    return {
      status: "ok",
      message: "Customers fetched successfully",
      data: customers,
    };
  } catch (err) {
    console.error("Error fetching customers:", err);
    return {
      status: "error",
      message: "Failed to fetch customers",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

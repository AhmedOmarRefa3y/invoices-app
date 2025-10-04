"use server";

import prismaDb from "@/lib/prisma";
import { revalidateApp } from "./customer";

export async function CreatePayment(Data: {
  CustomerId: string;
  PaymentDate: Date | undefined;
  Method: string;
  amount: number;
  Note?: string | undefined;
  orgid: string;
}) {
  try {
    if (!Data.orgid) {
      throw new Error("orgid is required");
    }
    if (!Data.CustomerId) {
      throw new Error("Customer ID is required");
    }
    if (!Data.PaymentDate) {
      throw new Error("Payment date is required");
    }
    if (!Data.Method) {
      throw new Error("Method is required");
    }
    if (!Data.amount) {
      throw new Error("Amount is required");
    }
    const NewPayment = await prismaDb.payment.create({
      data: {
        customerId: Data.CustomerId,
        date: Data.PaymentDate,
        method: Data.Method,
        amount: Data.amount,
        notes: Data.Note,
        organizationId: Data.orgid,
      },
    });
    revalidateApp();
    return {
      status: "ok",
      message: "Payment created successfully",
      Data: NewPayment,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while creating payment",
    };
  }
}

export async function EditPayment(Data: {
  CustomerId: string;
  PaymentDate: Date | undefined;
  Method: string;
  amount: number;
  Note?: string | undefined;
  PaymentId: string | undefined;
}) {
  try {
    if (!Data.PaymentId) {
      throw new Error("Payment ID is required");
    }
    if (!Data.CustomerId) {
      throw new Error("Customer ID is required");
    }
    if (!Data.PaymentDate) {
      throw new Error("Payment date is required");
    }
    if (!Data.Method) {
      throw new Error("Method is required");
    }
    if (!Data.amount) {
      throw new Error("Amount is required");
    }
    const EditPaymentT = await prismaDb.payment.update({
      where: {
        id: Data.PaymentId,
      },
      data: {
        customerId: Data.CustomerId,
        date: Data.PaymentDate,
        method: Data.Method,
        amount: Data.amount,
        notes: Data.Note,
      },
    });
    revalidateApp();
    return {
      status: "ok",
      message: "Edited payment successfully",
      Data: EditPaymentT,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while editing payment",
    };
  }
}

export async function DeletePayment(id: string) {
  try {
    if (!id) {
      throw new Error("Payment ID is required");
    }
    const DeletePayment = await prismaDb.payment.delete({
      where: {
        id,
      },
    });
    revalidateApp();
    // console.log("Deleted Payment", DeletePayment);
    return {
      status: "ok",
      message: "Deleted payment successfully",
      Data: DeletePayment,
    };
  } catch (error) {
    // Handle Prisma constraint errors specifically
    if (error instanceof Error) {
      if (error.message.includes("Constraint") || error.message.includes("foreign key")) {
        return {
          status: "error",
          message: "Cannot delete payment because it is associated with invoices",
        };
      }

      return {
        status: "error",
        message: error.message,
      };
    }

    return {
      status: "error",
      message: "Something went wrong while deleting payment",
    };
  }
}

export async function CreateSupplierPayment(Data: {
  SupplierId: string;
  PaymentDate: Date | undefined;
  Method: string;
  amount: number;
  Note?: string | undefined;
  orgid: string;
}) {
  try {
    if (!Data.orgid) {
      throw new Error("orgid is required");
    }
    if (!Data.SupplierId) {
      throw new Error("Supplier ID is required");
    }
    if (!Data.PaymentDate) {
      throw new Error("Payment date is required");
    }
    if (!Data.Method) {
      throw new Error("Method is required");
    }
    if (!Data.amount) {
      throw new Error("Amount is required");
    }

    // Verify that the customer is actually a supplier
    const supplier = await prismaDb.customer.findUnique({
      where: {
        id: Data.SupplierId,
        IsASupplier: true,
      },
    });

    if (!supplier) {
      throw new Error("Selected customer is not a supplier");
    }

    const NewSupplierPayment = await prismaDb.paymentToSupplier.create({
      data: {
        customerId: Data.SupplierId,
        date: Data.PaymentDate,
        method: Data.Method,
        amount: Data.amount,
        notes: Data.Note,
        organizationId: Data.orgid,
      },
    });
    revalidateApp();
    return {
      status: "ok",
      message: "Supplier payment created successfully",
      Data: NewSupplierPayment,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating supplier payment",
    };
  }
}

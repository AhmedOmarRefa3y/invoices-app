"use server";
import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const revalidateApp = () => {
    console.log("revalidateApp");
    revalidatePath("/accounts-reports");
    revalidatePath("/accounts-reports/customer-credit");
    revalidatePath("/accounts-reports/customer-credit-with-items");
    revalidatePath("/addinvoice");
    revalidatePath("/addinvoice/sales");
    revalidatePath("/addinvoice/sales-returns");
    revalidatePath("/inventory/");
    revalidatePath("/inventory/composed-items");
    revalidatePath("/inventory/product-records");
    revalidatePath("/invoices/sales");
    revalidatePath("/invoices/sales/showInvoice");
    revalidatePath("/invoices/sales/releaseorder");
    revalidatePath("/Payments");
    revalidatePath("/returnedInvoices");
    revalidatePath("/returnedInvoices/showREtInvoice");
    revalidatePath("/", "layout");
};

export async function CreateCustomer(Data: {
    customerName: string;
    location?: string | undefined;
    phoneNumber?: string | undefined;
    OpenCredit?: number | undefined;
}) {
    try {
        if (!Data.customerName) {
            throw new Error("Customer name is required");
        }
        const NewCustomer = await prismaDb.customer.create({
            data: {
                name: Data.customerName,
                phoneNumber: Data.phoneNumber,
                location: Data.location,
                CustomerCredit: Data.OpenCredit,
            },
        });
        if (!NewCustomer) {
            throw new Error("Failed to create customer");
        }
        revalidateApp();
        return {
            status: "ok",
            message: "Customer created successfully",
            Data: NewCustomer,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating customer",
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
                error instanceof Error
                    ? error.message
                    : "Something went wrong while Updating customer",
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
        return DeleteCustomer;
    } catch (error) {
        return null;
    }
}

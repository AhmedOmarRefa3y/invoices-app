"use server";
import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
        revalidatePath("/addinvoice/sales");
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
        revalidatePath("/addinvoice/sales");
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
        console.log(DeleteCustomer);
        revalidatePath("/accounts-reports");
        return DeleteCustomer;
    } catch (error) {
        return null;
    }
}

export async function CreatePayment(Data: {
    CustomerId: string;
    PaymentDate: Date | undefined;
    Method: string;
    amount: number;
    Note?: string | undefined;
}) {
    try {
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
            },
        });
        revalidatePath("/Payments");
        revalidatePath("/accounts-reports");
        revalidatePath("/accounts-reports/customer-credit");
        revalidatePath("/accounts-reports/customer-credit-with-items");
        revalidatePath("/addinvoice/sales");
        return {
            status: "ok",
            message: "Payment created successfully",
            Data: NewPayment,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating payment",
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
        revalidatePath("/Payments");
        revalidatePath("/accounts-reports");
        revalidatePath("/accounts-reports/customer-credit");
        revalidatePath("/accounts-reports/customer-credit-with-items");
        revalidatePath("/addinvoice/sales");
        console.log("Edited Payment", EditPaymentT);
        return {
            status: "ok",
            message: "Edited payment successfully",
            Data: EditPaymentT,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while editing payment",
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
        revalidatePath("/Payments");
        revalidatePath("/accounts-reports");
        revalidatePath("/accounts-reports/customer-credit");
        revalidatePath("/accounts-reports/customer-credit-with-items");
        revalidatePath("/addinvoice/sales");
        console.log("Deleted Payment", DeletePayment);
        return {
            status: "ok",
            message: "Deleted payment successfully",
            Data: DeletePayment,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while deleting payment",
        };
    }
}

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
        if (!Data.CustomerId) {
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
        revalidateApp();
        // console.log("Deleted Payment", DeletePayment);
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

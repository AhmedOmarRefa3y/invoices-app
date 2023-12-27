"use server";
import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateCustomer(Data: {
    id: string | undefined;
    customerName: string;
    location?: string | undefined;
    phoneNumber?: string | undefined;
    OpenCredit?: number | undefined;
}) {
    try {
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
        console.log("Updated Customer", UpdateCustomer);
        revalidatePath("/addinvoice/sales");
        return UpdateCustomer;
    } catch (error) {
        return null;
    }
}

export async function CreateCustomer(Data: {
    customerName: string;
    location?: string | undefined;
    phoneNumber?: string | undefined;
    OpenCredit?: number | undefined;
}) {
    try {
        const NewCustomer = await prismaDb.customer.create({
            data: {
                name: Data.customerName,
                phoneNumber: Data.phoneNumber,
                location: Data.location,
                CustomerCredit: Data.OpenCredit,
            },
        });
        revalidatePath("/addinvoice/sales");
        console.log("New Customer", NewCustomer);
        return NewCustomer;
    } catch (error) {
        return null;
    }
}

export async function DeleteCustomer(id: string) {
    try {
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
    PaymentId: string | undefined;
}) {
    try {
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
        console.log("New Payment", NewPayment);
        return NewPayment;
    } catch (error) {
        return null;
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
        return EditPaymentT;
    } catch (error) {
        return null;
    }
}
export async function DeletePayment(id: string) {
    try {
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
        console.log("Edited Payment", DeletePayment);
        return DeletePayment;
    } catch (error) {
        return null;
    }
}

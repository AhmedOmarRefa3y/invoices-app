"use server";
import prismaDb from "@/lib/prisma";

interface getTransactionsProps {
    orgid: string;
    customerID: string;
    page: number;
    pageSize: number;
}

export const getTransactions = async ({
    orgid,
    customerID,
    page,
    pageSize,
}: getTransactionsProps) => {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    try {
        const Data = await prismaDb.customer.findFirst({
            where: {
                organizationId: orgid,
                id: customerID,
            },
            include: {
                invoices: true,
                Payment: true,
                ReturnedInvoice: true,
            },
        });
        console.log(Data?.invoices);

        if (!Data) {
            throw new Error("Customer not found");
        }
        const CustomerAllTranscations: {
            type: "Debit" | "credit" | "openCredit";
            amount: number;
            date?: Date;
            number?: number;
            label: "inv" | "paymnet" | "returns" | "openCredit";
            effect?: number;
            creditAfter?: number;
        }[] = [];
        Data.invoices.map((item) => {
            CustomerAllTranscations.push({
                type: "Debit",
                amount: item.amount,
                date: item.date,
                number: item.number,
                label: "inv",
                effect: item.amount,
            });
        }),
            Data.Payment.map((item) => {
                CustomerAllTranscations.push({
                    type: "credit",
                    amount: item.amount,
                    date: item.date,
                    number: item.number,
                    label: "paymnet",
                    effect: -item.amount,
                });
            }),
            Data.ReturnedInvoice.map((item) => {
                CustomerAllTranscations.push({
                    type: "credit",
                    amount: item.amount,
                    number: item.number,
                    date: item.date,
                    label: "returns",
                    effect: -item.amount,
                });
            });
        Data.CustomerCredit !== 0 &&
            CustomerAllTranscations.push({
                type: "openCredit",
                amount: Data.CustomerCredit,
                label: "openCredit",
                effect: Data.CustomerCredit,
            });

        CustomerAllTranscations.sort((a, b) => {
            const dateA = a.date?.getTime() || 0;
            const dateB = b.date?.getTime() || 0;

            return dateA - dateB;
        });

        // Calculate running credit balance
        let currentCredit = 0;
        CustomerAllTranscations.forEach((transaction) => {
            transaction.creditAfter = currentCredit + (transaction.effect || 0);
            currentCredit = transaction.creditAfter;
        });
        const paginatedTransactions = CustomerAllTranscations.slice(
            skip,
            skip + take
        );
        console.log(paginatedTransactions);
        return {
            status: "ok",
            Data: paginatedTransactions,
        };
    } catch (error) {
        return {
            status: "error",
            message: "Internal server error",
        };
    }
};

import { Prisma } from "@prisma/client";

type CustomerData = Prisma.CustomerGetPayload<{
    include: {
        invoices: true;
        Payment: true;
        ReturnedInvoice: true;
    };
}>;
interface getTransactionsProps {
    Data: CustomerData;
    page: number;
    pageSize: number;
}
export const getTransactions = ({
    Data,
    page,
    pageSize,
}: getTransactionsProps) => {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // if (!Data) {
    //     throw new Error("Customer not found");
    // }
    const CustomerAllTranscations: {
        type: "Debit" | "credit" | "openCredit";
        amount: number;
        date?: Date;
        number?: number;
        label: "inv" | "paymnet" | "returns" | "openCredit" | "prev";
        effect?: number;
        creditAfter: number;
    }[] = [];
    Data.invoices.map((item) => {
        CustomerAllTranscations.push({
            type: "Debit",
            amount: item.amount,
            date: item.date,
            number: item.number,
            label: "inv",
            effect: item.amount,
            creditAfter: 0,
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
                creditAfter: 0,
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
                creditAfter: 0,
            });
        });

    CustomerAllTranscations.sort((a, b) => {
        const dateA = a.date?.getTime() || 0;
        const dateB = b.date?.getTime() || 0;

        return dateA - dateB;
    });

    Data.CustomerCredit !== 0 &&
        CustomerAllTranscations.unshift({
            type: "openCredit",
            amount: Data.CustomerCredit,
            label: "openCredit",
            effect: Data.CustomerCredit,
            creditAfter: 0,
        });

    let currentCredit = 0;
    CustomerAllTranscations.forEach((transaction) => {
        transaction.creditAfter = currentCredit + (transaction.effect || 0);
        currentCredit = transaction.creditAfter;
    });

    const paginatedTransactions = CustomerAllTranscations.slice(
        skip,
        skip + take
    );

    if (page > 1 && CustomerAllTranscations[skip - 1]) {
        paginatedTransactions.unshift({
            type:
                CustomerAllTranscations[skip - 1].creditAfter > 0
                    ? "Debit"
                    : "credit",
            amount: CustomerAllTranscations[skip - 1].creditAfter,
            label: "prev",
            creditAfter: 0,
        });
    }

    return {
        Data: paginatedTransactions,
        maxItems: CustomerAllTranscations.length,
    };
};

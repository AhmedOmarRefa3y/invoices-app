import AddNewPaymentModal from "@/components/addNewPaymentModal";
import prismaDb from "@/lib/prisma";
import React from "react";

const page = async () => {
    const customers = await prismaDb.customer.findMany({
        include: {
            invoices: {
                include: {
                    lineItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
            Payment: true,
        },
    });

    return <AddNewPaymentModal customers={customers} />;
};

export default page;

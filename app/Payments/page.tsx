import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";
import Refetch from "@/components/refetch";
import prismaDb from "@/lib/prisma";
import React from "react";

export const dynamic = "force-dynamic";
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

    return (
        <>
            <Refetch />
            <AddNewPaymentModal customers={customers} />;
        </>
    );
};

export default page;

import prismaDb from "@/lib/prisma";

import ReturnedInvoicePage from "./ReturnedInvoicePage";

const page = async ({ params }: { params: { orgid: string } }) => {
    const orginzation = await prismaDb.organization.findUnique({
        where: {
            id: params.orgid,
        },
        include: {
            Customer: {
                include: {
                    invoices: true,
                    Payment: true,
                    ReturnedInvoice: true,
                },
            },
            products: {
                include: {
                    Part: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            },
        },
    });

    return (
        <>
            <ReturnedInvoicePage
                customers={orginzation!.Customer}
                products={orginzation!.products}
            />
        </>
    );
};

export default page;

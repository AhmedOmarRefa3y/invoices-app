import prismaDb from "@/lib/prisma";

import ReturnedInvoicePage from "./ReturnedInvoicePage";

const page = async () => {
    const customers = await prismaDb.customer.findMany({
        include: {
            invoices: true,
            Payment: true,
            ReturnedInvoice: true,
        },
    });
    const products = await prismaDb.product.findMany({
        orderBy: {
            name: "asc",
        },
    });
    const productsPackages = await prismaDb.productPackage.findMany({
        include: {
            Parts: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <>
            <ReturnedInvoicePage
                products={products}
                customers={customers}
                productsPackages={productsPackages}
            />
        </>
    );
};

export default page;

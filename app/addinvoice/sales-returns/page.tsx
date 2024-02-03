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
        include:{
            Part:true
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
           
            />
        </>
    );
};

export default page;

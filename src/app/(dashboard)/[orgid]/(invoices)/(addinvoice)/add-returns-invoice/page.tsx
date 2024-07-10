import prismaDb from "@/lib/prisma";

import ReturnedInvoicePage from "./ReturnedInvoicePage";
import { GetSalesData } from "../add-sales-invoice/sales-utils";

const page = async ({ params }: { params: { orgid: string } }) => {
    const { CustomersWithBalances, products } = await GetSalesData(
        params.orgid
    );

    return (
        <ReturnedInvoicePage
            products={products}
            customersBalannces={CustomersWithBalances}
        />
    );
};

export default page;

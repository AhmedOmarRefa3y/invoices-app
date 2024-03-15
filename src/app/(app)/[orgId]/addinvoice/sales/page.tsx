import AddInvoicePage from "./AddInvoicePage";
import { GetSalesData } from "./sales-utils";

const page = async ({ params }: { params: { orgid: string } }) => {
    console.log(params);
    const { customers, formattedCustomers, products } = await GetSalesData(
        params.orgid
    );
    return (
        <>
            <AddInvoicePage
                products={products}
                customers={customers}
                customersBalannces={formattedCustomers}
            />
        </>
    );
};

export default page;

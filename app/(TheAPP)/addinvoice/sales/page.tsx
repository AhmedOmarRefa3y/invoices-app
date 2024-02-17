import AddInvoicePage from "./AddInvoicePage";
import { GetSalesData } from "./sales-utils";

const page = async () => {
    const { customers, formattedCustomers, products } = await GetSalesData();
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

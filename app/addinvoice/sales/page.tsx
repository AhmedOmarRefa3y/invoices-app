import AddInvoicePage from "./AddInvoicePage";
import { GetSalesData } from "./sales-utils";

const page = async () => {
    const { customers, formattedCustomers, products, productsPackages } =
        await GetSalesData();
    return (
        <>
            <AddInvoicePage
                products={products}
                customers={customers}
                customersBalannces={formattedCustomers}
                productsPackages={productsPackages}
            />
        </>
    );
};

export default page;

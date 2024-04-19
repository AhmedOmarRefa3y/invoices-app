import useInvoice from "@/lib/zustand/invoiceStore";
import AddInvoicePage from "./AddInvoicePage";
import { GetSalesData } from "./sales-utils";

const page = async ({ params }: { params: { orgid: string } }) => {
    const { CustomersWithBalances, products } = await GetSalesData(
        params.orgid
    );

    return (
        <>
            <AddInvoicePage
                products={products}
                customersBalannces={CustomersWithBalances}
            />
            {/* <div className="bg-blue-300 h-full w-[200px]">
                <div className="flex max-w-[300px] gap-2  bg-amber-500 mx-auto overflow-auto">
                    <div className="min-w-[200px] bg-red-500 h-[50px] "></div>
                    <div className="min-w-[200px] bg-red-500 h-[50px]"></div>
                    <div className="min-w-[200px] bg-red-500 h-[50px]"></div>
                    <div className="min-w-[200px] bg-red-500 h-[50px]"></div>
                    <div className="min-w-[200px] bg-red-500 h-[50px]"></div>
                </div>
            </div> */}
        </>
    );
};

export default page;

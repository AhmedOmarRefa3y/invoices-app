import useInvoice from "@/lib/zustand/invoiceStore";
import AddInvoicePage from "./AddInvoicePage";
import { GetSalesData } from "./sales-utils";

const page = async ({ params }: { params: { orgid: string } }) => {
  const { CustomersWithBalances, products } = await GetSalesData(params.orgid);

  return <AddInvoicePage products={products} customersBalannces={CustomersWithBalances} />;
};

export default page;

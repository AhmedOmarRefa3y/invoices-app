import { Metadata } from "next";
import AddInvoicePage from "./AddInvoicePage";
import { GetSalesData } from "./sales-utils";

export const metadata: Metadata = {
  title: "New Invoice - Edara ™",
  description: "ERP system",
};

const page = async ({ params }: { params: Promise<{ orgid: string }> }) => {
  const { CustomersWithBalances, products } = await GetSalesData((await params).orgid);

  return <AddInvoicePage products={products} customersBalannces={CustomersWithBalances} />;
};

export default page;

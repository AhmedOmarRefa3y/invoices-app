import ReturnedInvoicePage from "./ReturnedInvoicePage";
import { GetSalesData } from "../add-sales-invoice/sales-utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Ruturns Inovice - Edara ™",
  description: "ERP system",
};

const page = async ({ params }: { params: Promise<{ orgid: string }> }) => {
  const { CustomersWithBalances, products } = await GetSalesData((await params).orgid);

  return <ReturnedInvoicePage products={products} customersBalannces={CustomersWithBalances} />;
};

export default page;

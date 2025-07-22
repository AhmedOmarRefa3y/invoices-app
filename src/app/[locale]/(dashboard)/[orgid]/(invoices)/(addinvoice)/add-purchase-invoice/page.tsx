import { GetPurchasesData } from "./purchase-utils";
import AddPurchaseInvoice from "./AddPurchaseInvoice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase Invoice - Edara ™",
  description: "ERP system",
};

const PurchasePage = async ({ params }: { params: { orgid: string } }) => {
  const { SuppliersWithBalances, products } = await GetPurchasesData(params.orgid);

  return <AddPurchaseInvoice products={products} customersBalannces={SuppliersWithBalances} />;
};

export default PurchasePage;

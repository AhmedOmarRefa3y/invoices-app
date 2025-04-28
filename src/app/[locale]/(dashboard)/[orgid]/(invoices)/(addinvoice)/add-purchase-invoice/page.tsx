import { GetPurchasesData } from "./purchase-utils";
import AddPurchaseInvoice from "./AddPurchaseInvoice";

const PurchasePage = async ({ params }: { params: { orgid: string } }) => {
  const { SuppliersWithBalances, products } = await GetPurchasesData(params.orgid);

  return <AddPurchaseInvoice products={products} customersBalannces={SuppliersWithBalances} />;
};

export default PurchasePage;

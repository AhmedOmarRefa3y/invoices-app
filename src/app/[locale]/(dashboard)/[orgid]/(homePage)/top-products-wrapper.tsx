import { getTopProducts, Period } from "./top-products-data";
import TopProductsTable from "./top-products-table";

interface TopProductsWrapperProps {
  orgid: string;
}

export default async function TopProductsWrapper({ orgid }: TopProductsWrapperProps) {
  const initialData = await getTopProducts(orgid, "year");

  return (
    <TopProductsTable
      initialData={initialData}
      period="year"
      onPeriodChange={async (newPeriod: Period) => {
        "use server";
        return await getTopProducts(orgid, newPeriod);
      }}
    />
  );
}

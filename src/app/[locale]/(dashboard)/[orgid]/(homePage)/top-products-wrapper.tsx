import TopProductsTable from "@/app/[locale]/(dashboard)/[orgid]/(homePage)/components/top-products-table";
import { getTopProducts, Period } from "./data/top-products-data";

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

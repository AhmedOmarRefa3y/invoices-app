import TopCustomersTable from "@/app/[locale]/(dashboard)/[orgid]/(homePage)/components/top-customers-table";
import { getTopCustomers, Period } from "./data/top-customers-data";

interface TopCustomersWrapperProps {
  orgid: string;
}

export default async function TopCustomersWrapper({ orgid }: TopCustomersWrapperProps) {
  const initialData = await getTopCustomers(orgid, "year");

  return (
    <TopCustomersTable
      initialData={initialData}
      period="year"
      onPeriodChange={async (newPeriod: Period) => {
        "use server";
        return await getTopCustomers(orgid, newPeriod);
      }}
    />
  );
}

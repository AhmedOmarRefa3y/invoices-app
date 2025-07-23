import { getTopCustomers, Period } from "./top-customers-data";
import TopCustomersTable from "./top-customers-table";

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

import SalesChart from "./sales-chart";
import { getMonthlySales } from "./sales-data";

export default async function SalesChartWrapper({ orgid }: { orgid: string }) {
  const data = await getMonthlySales(orgid);
  return <SalesChart initialData={data} />;
}

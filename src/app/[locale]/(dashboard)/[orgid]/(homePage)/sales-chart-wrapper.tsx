import SalesChart from "./components/sales-chart";
import { getMonthlySales } from "./data/sales-data";

export default async function SalesChartWrapper({ orgid }: { orgid: string }) {
  const data = await getMonthlySales(orgid);
  return <SalesChart initialData={data} />;
}

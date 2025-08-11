import { Metadata } from "next";
import Actions from "./Actions";
import InvoiceTableWrapper from "./invoice-table-wrapper";
import SalesChartWrapper from "./sales-chart-wrapper";
import StatsCardsWrapper from "./stats-cards-wrapper";
import TopCustomersWrapper from "./top-customers-wrapper";
import TopProductsWrapper from "./top-products-wrapper";

export const metadata: Metadata = {
  title: "Dashboard - Edara ™",
  description: "ERP system",
};

export default function Home({ params }: { params: { orgid: string; locale: string } }) {
  return (
    <div className="flex flex-col md:flex-row  h-full overflow-y-auto p-2 gap-2 ">
      <div className="flex md:w-1/3 flex-col gap-2 md:h-full overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <Actions />
        </div>

        <div className="flex-1 overflow-hidden">
          <SalesChartWrapper orgid={params.orgid} />
        </div>
      </div>
      <div className="flex flex-col md:w-1/3 gap-2 md:h-full overflow-hidden">
        <div className="h-[400px] md:flex-1 md:h-full overflow-hidden">
          <TopProductsWrapper orgid={params.orgid} />
        </div>

        <div className="flex-1 h-full overflow-hidden">
          <StatsCardsWrapper orgid={params.orgid} locale={params.locale} />
        </div>
      </div>
      <div className="flex flex-col md:w-1/3 gap-2 h-full overflow-hidden">
        <div className="h-[400px] md:flex-1 md:h-full overflow-hidden">
          <TopCustomersWrapper orgid={params.orgid} />
        </div>

        <div className="h-[400px] md:flex-1 md:h-full overflow-hidden">
          <InvoiceTableWrapper orgid={params.orgid} />
        </div>
      </div>
    </div>
  );
}

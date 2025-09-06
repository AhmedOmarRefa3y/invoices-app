import { Metadata } from "next";
import { Suspense } from "react";
import Actions from "./components/Actions";
import InvoiceTableWrapper from "./invoice-table-wrapper";
import SalesChartWrapper from "./sales-chart-wrapper";
import StatsCardsWrapper from "./stats-cards-wrapper";
import TopCustomersWrapper from "./top-customers-wrapper";
import TopProductsWrapper from "./top-products-wrapper";
import {
  StatsCardsLoading,
  InvoiceTableLoading,
  SalesChartLoading,
  TopProductsLoading,
  TopCustomersLoading
} from "./components/loading-components";

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
          <Suspense fallback={<SalesChartLoading />}>
            <SalesChartWrapper orgid={params.orgid} />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col md:w-1/3 gap-2 md:h-full overflow-hidden">
        <div className="h-[400px] md:flex-1 md:h-full overflow-hidden">
          <Suspense fallback={<TopProductsLoading />}>
            <TopProductsWrapper orgid={params.orgid} />
          </Suspense>
        </div>

        <div className="flex-1 h-full overflow-hidden">
          <Suspense fallback={<StatsCardsLoading />}>
            <StatsCardsWrapper orgid={params.orgid} locale={params.locale} />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col md:w-1/3 gap-2 h-full overflow-hidden">
        <div className="h-[400px] md:flex-1 md:h-full overflow-hidden">
          <Suspense fallback={<TopCustomersLoading />}>
            <TopCustomersWrapper orgid={params.orgid} />
          </Suspense>
        </div>

        <div className="h-[400px] md:flex-1 md:h-full overflow-hidden">
          <Suspense fallback={<InvoiceTableLoading />}>
            <InvoiceTableWrapper orgid={params.orgid} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

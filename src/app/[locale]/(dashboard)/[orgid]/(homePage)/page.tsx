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

export default function Home({ params }: { params: { orgid: string } }) {
  return (
    <div className="bg-gray-50 p-2 md:p-4 gap-2 md:gap-4 flex flex-col h-full w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4 h-full w-full">
        {/* Left column - spans full width on mobile, 2/3 on large screens */}
        <div className="lg:col-span-2 flex flex-col gap-2 md:gap-4 h-full">
          {/* Top section - responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 h-full">
            <div className="h-64 md:h-full rounded-xl bg-white shadow-md p-4">
              <div className="h-full overflow-hidden">
                <TopProductsWrapper orgid={params.orgid} />
              </div>
            </div>
            <div className="h-64 md:h-full rounded-xl bg-white shadow-md p-4">
              <div className="h-full overflow-hidden">
                <Actions />
              </div>
            </div>
          </div>
          
          {/* Bottom section - responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 h-full">
            <div className="h-64 md:h-full rounded-xl bg-white shadow-md p-4">
              <div className="h-full overflow-hidden">
                <StatsCardsWrapper orgid={params.orgid} />
              </div>
            </div>
            <div className="h-64 md:h-full rounded-xl bg-white shadow-md p-4">
              <div className="h-full overflow-hidden">
                <SalesChartWrapper orgid={params.orgid} />
              </div>
            </div>
          </div>
        </div>

        {/* Right column - spans full width on mobile, 1/3 on large screens */}
        <div className="flex flex-col gap-2 md:gap-4 h-full">
          <div className="h-64 md:h-[45%] rounded-xl bg-white shadow-md p-4">
            <div className="h-full overflow-hidden">
              <TopCustomersWrapper orgid={params.orgid} />
            </div>
          </div>
          <div className="h-64 md:h-[55%] rounded-xl bg-white shadow-md p-4">
            <div className="h-full overflow-hidden">
              <InvoiceTableWrapper orgid={params.orgid} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import Actions from "./Actions";
import InvoiceTableWrapper from "./invoice-table-wrapper";
import SalesChartWrapper from "./sales-chart-wrapper";
import StatsCardsWrapper from "./stats-cards-wrapper";
import TopCustomersWrapper from "./top-customers-wrapper";
import TopProductsWrapper from "./top-products-wrapper";

export default function Home({ params }: { params: { orgid: string } }) {
  return (
    <div className="bg-gray-50 p-2 gap-2 flex h-full w-full">
      <div className="flex gap-2 w-full h-full">
        <div className="w-4/6 flex flex-col gap-2 h-full">
          <div className="flex gap-2 h-1/2">
            <div className="w-5/12 h-full overflow-auto rounded-lg bg-white shadow-lg">
              <TopProductsWrapper orgid={params.orgid} />
            </div>
            <div className="w-7/12 h-full">
              <Actions />
            </div>
          </div>
          <div className="h-1/2 flex gap-2">
            <div className="min-w-[50%] h-full">
              <StatsCardsWrapper orgid={params.orgid} />
            </div>
            <SalesChartWrapper orgid={params.orgid} />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-2/6 h-full">
          <div className="h-[45%]">
            <TopCustomersWrapper orgid={params.orgid} />
          </div>
          <div className="h-[55%]">
            <InvoiceTableWrapper orgid={params.orgid} />
          </div>
        </div>
      </div>
    </div>
  );
}
